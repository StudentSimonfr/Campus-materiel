import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/useApp";
import type { Equipement } from "../../data/donnees-initiales";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function Gestion() {
  const { catalogue, isAvailable, deleteEquipment } = useApp();
  const [toDelete, setToDelete] = useState<Equipement | null>(null);

  const confirmDelete = () => {
    if (toDelete) deleteEquipment(toDelete.id); // le refus (équipement réservé) est géré dans le contexte
    setToDelete(null);
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
                    <button className="btn danger" onClick={() => setToDelete(e)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog open={toDelete !== null} title="Supprimer cet équipement ?"
        confirmLabel="Supprimer" onConfirm={confirmDelete} onCancel={() => setToDelete(null)}>
        <p>Vous allez supprimer <strong>{toDelete?.nom}</strong>. Cette action est définitive.</p>
      </ConfirmDialog>
    </section>
  );
}
