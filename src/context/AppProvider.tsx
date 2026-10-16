import { useState, type ReactNode } from "react";
import { AppContext, type AppState, type EquipementData, type Notice, type Result } from "./AppContext";
import {
  COMPTES_INITIAUX, EQUIPEMENTS_INITIAUX, RESERVATIONS_INITIALES,
  type Equipement, type Reservation,
} from "../data/donnees-initiales";
import { load, save, remove, newUuid } from "../services/storage";

const KEYS = { catalogue: "cm_catalogue", reservations: "cm_reservations", session: "cm_session" };

// Au démarrage : on restaure les données enregistrées ; les données initiales
// ne sont utilisées (et écrites) que si la clé n'existe pas. Un tableau vide enregistré est valide.
function restore() {
  const c = load<Equipement[]>(KEYS.catalogue);
  const r = load<Reservation[]>(KEYS.reservations);
  const s = load<number>(KEYS.session);
  const catalogue = c.found && Array.isArray(c.value) ? c.value : structuredClone(EQUIPEMENTS_INITIAUX);
  const reservations = r.found && Array.isArray(r.value) ? r.value : structuredClone(RESERVATIONS_INITIALES);
  let error = c.error || r.error || s.error;
  if (!c.found && !c.error && !save(KEYS.catalogue, catalogue)) error = true;
  if (!r.found && !r.error && !save(KEYS.reservations, reservations)) error = true;
  const userId = s.found && typeof s.value === "number" ? s.value : null;
  return { catalogue, reservations, userId, error };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [init] = useState(restore);
  const [catalogue, setCatalogue] = useState<Equipement[]>(init.catalogue);
  const [reservations, setReservations] = useState<Reservation[]>(init.reservations);
  const [userId, setUserId] = useState<number | null>(
    COMPTES_INITIAUX.some((u) => u.id === init.userId) ? init.userId : null
  );
  const [storageError, setStorageError] = useState(init.error);
  const [notice, setNotice] = useState<Notice | null>(null);

  const user = COMPTES_INITIAUX.find((u) => u.id === userId) ?? null;

  // ----- outils internes -----
  const notify = (text: string, type: Notice["type"] = "success") => setNotice({ text, type, key: Date.now() });
  const ok = (text: string): Result => { notify(text); return { ok: true, message: text }; };
  const fail = (text: string): Result => { notify(text, "error"); return { ok: false, message: text }; };
  const persist = (key: string, value: unknown) => { if (!save(key, value)) setStorageError(true); };
  const setCat = (next: Equipement[]) => { setCatalogue(next); persist(KEYS.catalogue, next); };
  const setRes = (next: Reservation[]) => { setReservations(next); persist(KEYS.reservations, next); };

  // ----- disponibilité : toujours CALCULÉE depuis les réservations actives -----
  const reservationOf = (equipementId: number) => reservations.find((r) => r.equipementId === equipementId);
  const isAvailable = (equipementId: number) => !reservationOf(equipementId);
  const getEquipment = (id: number) => catalogue.find((e) => e.id === id);

  // ----- session -----
  const login = (id: number) => { setUserId(id); persist(KEYS.session, id); };
  const logout = () => { setUserId(null); remove(KEYS.session); };

  // ----- réservations -----
  const reserve = (equipementId: number): Result => {
    if (user?.role !== "student") return fail("Seuls les étudiants peuvent réserver du matériel.");
    if (!getEquipment(equipementId)) return fail("Cet équipement n'existe pas.");
    if (!isAvailable(equipementId)) return fail("Cet équipement est déjà réservé.");
    setRes([...reservations, { id: newUuid(), equipementId, etudiantId: user.id }]);
    return ok("Réservation effectuée.");
  };
  const cancelReservation = (reservationId: string): Result => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res || res.etudiantId !== user?.id) return fail("Vous ne pouvez annuler que vos propres réservations.");
    setRes(reservations.filter((r) => r.id !== reservationId)); // annuler = retirer l'entrée
    return ok("Réservation annulée : l'équipement est de nouveau disponible.");
  };

  // ----- gestion du catalogue (responsable) -----
  const requireManager = (): Result | null => (user?.role === "manager" ? null : fail("Action réservée au responsable."));
  const addEquipment = (data: EquipementData): Result => {
    const denied = requireManager(); if (denied) return denied;
    const id = Math.max(0, ...catalogue.map((e) => e.id)) + 1; // identifiant unique (pas length + 1)
    setCat([...catalogue, { ...data, id }]);
    return ok("Équipement ajouté.");
  };
  const updateEquipment = (id: number, data: EquipementData): Result => {
    const denied = requireManager(); if (denied) return denied;
    if (!getEquipment(id)) return fail("Cet équipement n'existe pas.");
    setCat(catalogue.map((e) => (e.id === id ? { ...e, ...data, id } : e)));
    return ok("Équipement modifié.");
  };
  const deleteEquipment = (id: number): Result => {
    const denied = requireManager(); if (denied) return denied;
    if (!isAvailable(id)) return fail("Suppression refusée : cet équipement a une réservation active. Attendez son annulation.");
    setCat(catalogue.filter((e) => e.id !== id));
    return ok("Équipement supprimé.");
  };

  const value: AppState = {
    user, users: COMPTES_INITIAUX, catalogue, reservations, storageError, notice, setNotice,
    isAvailable, reservationOf, getEquipment,
    login, logout, reserve, cancelReservation, addEquipment, updateEquipment, deleteEquipment,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
