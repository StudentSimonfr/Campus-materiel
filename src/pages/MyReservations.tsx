import { Link } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function MyReservations() {
  const { user, reservations, getEquipment, cancelReservation } = useApp();
  const mine = reservations.filter((r) => r.etudiantId === user?.id); // uniquement SES réservations

  return (
    <section>
      <h1>Mes réservations</h1>
      {mine.length === 0 ? (
        <p className="banner">Vous n'avez aucune réservation. <Link to="/catalogue">Parcourir le catalogue</Link></p>
      ) : (
        <ul className="list">
          {mine.map((r) => {
            const eq = getEquipment(r.equipementId);
            return (
              <li key={r.id} className="card row">
                <strong>{eq ? eq.nom : "Équipement supprimé"}</strong>
                <div className="actions">
                  {eq && <Link className="btn secondary" to={`/materiels/${eq.id}`}>Voir la fiche</Link>}
                  <button className="btn danger" onClick={() => cancelReservation(r.id)}>Annuler</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
