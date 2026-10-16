import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../context/useApp";
import EquipmentForm, { type FormValues } from "../../components/EquipmentForm";
import type { EquipementData } from "../../context/AppContext";

// Page utilisée pour /gestion/nouveau (pas d'id) et /gestion/:id/modifier (id présent).
export default function EquipmentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEquipment, addEquipment, updateEquipment } = useApp();
  const editing = id !== undefined;
  const equipment = editing ? getEquipment(Number(id)) : undefined;

  if (editing && !equipment) {
    return (
      <section>
        <h1>Équipement introuvable</h1>
        <p>Impossible de modifier un équipement qui n'existe pas.</p>
        <Link className="btn" to="/gestion">Retour à la gestion</Link>
      </section>
    );
  }
  const initial: FormValues = equipment
    ? { nom: equipment.nom, categorie: equipment.categorie, description: equipment.description, localisation: equipment.localisation }
    : { nom: "", categorie: "", description: "", localisation: "" };

  const handleSubmit = (data: EquipementData) => {
    const result = equipment ? updateEquipment(equipment.id, data) : addEquipment(data);
    if (result.ok) navigate("/gestion");
  };
  return (
    <section>
      <h1>{editing ? "Modifier l'équipement" : "Nouvel équipement"}</h1>
      <EquipmentForm initialValues={initial} submitLabel={editing ? "Enregistrer" : "Créer"}
        onSubmit={handleSubmit} onCancel={() => navigate("/gestion")} />
    </section>
  );
}
