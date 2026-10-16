import { createContext } from "react";
import type { Compte, Equipement, Reservation } from "../data/donnees-initiales";

export interface Result { ok: boolean; message: string }
export interface Notice { text: string; type: "success" | "error"; key: number }
export type EquipementData = Omit<Equipement, "id">;

export interface AppState {
  user: Compte | null;
  users: Compte[];
  catalogue: Equipement[];
  reservations: Reservation[];
  storageError: boolean;
  notice: Notice | null;
  setNotice: (n: Notice | null) => void;
  isAvailable: (equipementId: number) => boolean;
  reservationOf: (equipementId: number) => Reservation | undefined;
  getEquipment: (id: number) => Equipement | undefined;
  login: (id: number) => void;
  logout: () => void;
  reserve: (equipementId: number) => Result;
  cancelReservation: (reservationId: string) => Result;
  addEquipment: (data: EquipementData) => Result;
  updateEquipment: (id: number, data: EquipementData) => Result;
  deleteEquipment: (id: number) => Result;
}

export const AppContext = createContext<AppState | null>(null);
