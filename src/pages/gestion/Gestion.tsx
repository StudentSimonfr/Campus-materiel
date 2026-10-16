import { Link } from "react-router-dom";
import { useApp } from "../../context/useApp";
import type { Equipement } from "../../data/donnees-initiales";

export default function Gestion() {
  const { catalogue, isAvailable, deleteEquipment } = useApp();
  const handleDelete = (e: Equipement) => {
    if (window.confirm(`Supprimer « ${e.nom} » ?`)) deleteEquipment(e.id); // le refus est géré dans le contexte
  };
  return (
    <section>
      <div className="row"><h1>Gestion du catalogue</h1><Link className="btn" to="/gestion/nouveau">+ Nouvel équipement</Link></div>
      {catalogue.length === 0 ? (
        <p className="banner">Le catalogue est vide. Ajoutez un premier équipement.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nom</th><th>Catégorie</th><th>Localisation</th><th>État</th><th>Actions</th></tr></thead>
            <tbody>
              {catalogue.map((e) => (
                <tr key={e.id}>
                  <td>{e.nom}</td><td>{e.categorie}</td><td>{e.localisation}</td>
                  <td><span className={`badge ${isAvailable(e.id) ? "ok" : "ko"}`}>{isAvailable(e.id) ? "Disponible" : "Réservé"}</span></td>
                  <td className="actions">
                    <Link className="btn secondary" to={`/gestion/${e.id}/modifier`}>Modifier</Link>
                    <button className="btn danger" onClick={() => handleDelete(e)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
