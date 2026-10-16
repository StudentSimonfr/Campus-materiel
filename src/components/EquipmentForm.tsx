import { useState, type FormEvent } from "react";
import { CATEGORIES, type Categorie } from "../data/donnees-initiales";
import type { EquipementData } from "../context/AppContext";

export interface FormValues { nom: string; categorie: Categorie | ""; description: string; localisation: string }
type Errors = Partial<Record<keyof FormValues, string>>;

function validate(v: FormValues): Errors {
  const e: Errors = {};
  if (!v.nom.trim()) e.nom = "Le nom est obligatoire.";
  else if (v.nom.trim().length < 3) e.nom = "Le nom doit contenir au moins 3 caractères.";
  if (!v.categorie) e.categorie = "La catégorie est obligatoire.";
  if (!v.description.trim()) e.description = "La description est obligatoire.";
  else if (v.description.trim().length < 10) e.description = "La description doit contenir au moins 10 caractères.";
  if (!v.localisation.trim()) e.localisation = "La localisation est obligatoire.";
  return e;
}

interface Props {
  initialValues: FormValues;
  submitLabel: string;
  onSubmit: (data: EquipementData) => void;
  onCancel: () => void;
}

// Un SEUL formulaire (champs contrôlés) pour la création et la modification.
export default function EquipmentForm({ initialValues, submitLabel, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});

  const set = (key: keyof FormValues) => (value: string) => setValues({ ...values, [key]: value });
  const common = (key: keyof FormValues) => ({
    id: key,
    value: values[key],
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${key}-err` : undefined,
  });
  const error = (key: keyof FormValues) =>
    errors[key] && <p className="error-text" id={`${key}-err`}>{errors[key]}</p>;

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found); // en cas d'erreur, les valeurs saisies restent dans l'état
    if (Object.keys(found).length > 0 || values.categorie === "") return;
    onSubmit({
      nom: values.nom.trim(), categorie: values.categorie,
      description: values.description.trim(), localisation: values.localisation.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form">
      <div className="field">
        <label htmlFor="nom">Nom *</label>
        <input {...common("nom")} onChange={(e) => set("nom")(e.target.value)} />
        {error("nom")}
      </div>
      <div className="field">
        <label htmlFor="categorie">Catégorie *</label>
        <select {...common("categorie")} onChange={(e) => set("categorie")(e.target.value)}>
          <option value="">Choisir…</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {error("categorie")}
      </div>
      <div className="field">
        <label htmlFor="description">Description *</label>
        <textarea rows={4} {...common("description")} onChange={(e) => set("description")(e.target.value)} />
        {error("description")}
      </div>
      <div className="field">
        <label htmlFor="localisation">Localisation *</label>
        <input {...common("localisation")} onChange={(e) => set("localisation")(e.target.value)} />
        {error("localisation")}
      </div>
      <div className="actions">
        <button className="btn" type="submit">{submitLabel}</button>
        <button className="btn secondary" type="button" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}
