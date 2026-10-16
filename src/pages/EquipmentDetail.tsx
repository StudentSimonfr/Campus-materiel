import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function EquipmentDetail() {
  const { id } = useParams();
  const { user, getEquipment, reservationOf, reserve } = useApp();
  const equipmentId = Number(id);
  const equipment = getEquipment(equipmentId);

  if (!equipment) {
    return (
      <section>
        <h1>Équipement introuvable</h1>
        <p>Aucun équipement ne correspond à l'identifiant « {id} ».</p>
        <Link className="btn" to="/catalogue">Retour au catalogue</Link>
      </section>
    );
  }
  const reservation = reservationOf(equipmentId);
  const mine = reservation?.etudiantId === user?.id;

  return (
    <section>
      <Link to="/catalogue">← Retour au catalogue</Link>
      <h1>{equipment.nom}</h1>
      <p><span className="tag">{equipment.categorie}</span> <span className={`badge ${reservation ? "ko" : "ok"}`}>{reservation ? "Réservé" : "Disponible"}</span></p>
      <p>{equipment.description}</p>
      <p className="muted">📍 {equipment.localisation} — Référence : {equipment.id}</p>
      {user?.role === "student" && (
        reservation ? (
          <p className="banner">{mine ? "Vous avez réservé cet équipement." : "Cet équipement est déjà réservé."}</p>
        ) : (
          <button className="btn" onClick={() => reserve(equipmentId)}>Réserver cet équipement</button>
        )
      )}
    </section>
  );
}
