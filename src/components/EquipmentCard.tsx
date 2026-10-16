import { Link } from "react-router-dom";
import type { Equipement } from "../data/donnees-initiales";

interface Props {
  equipment: Equipement;
  available: boolean;
  onReserve?: (id: number) => void; // l'enfant transmet la demande de réservation à son parent
}

export default function EquipmentCard({ equipment, available, onReserve }: Props) {
  return (
    <article className="card">
      <span className="tag">{equipment.categorie}</span>
      <h3>{equipment.nom}</h3>
      <p className="muted">📍 {equipment.localisation}</p>
      <p><span className={`badge ${available ? "ok" : "ko"}`}>{available ? "Disponible" : "Réservé"}</span></p>
      <div className="actions">
        <Link className="btn secondary" to={`/materiels/${equipment.id}`}>Voir la fiche</Link>
        {onReserve && (
          <button className="btn" disabled={!available} onClick={() => onReserve(equipment.id)}>Réserver</button>
        )}
      </div>
    </article>
  );
}
