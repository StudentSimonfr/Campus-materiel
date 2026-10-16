import { useState } from "react";
import { useApp } from "../context/useApp";
import { CATEGORIES } from "../data/donnees-initiales";
import EquipmentCard from "../components/EquipmentCard";

export default function Catalogue() {
  const { user, catalogue, isAvailable, reserve } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const results = catalogue.filter(
    (e) => e.nom.toLowerCase().includes(search.trim().toLowerCase()) && (!category || e.categorie === category)
  );

  return (
    <section>
      <h1>Catalogue du matériel</h1>
      <div className="filters">
        <label>Recherche par nom
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ex. : portable" />
        </label>
        <label>Catégorie
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Toutes</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      {catalogue.length === 0 ? (
        <p className="banner">Le catalogue est vide pour le moment.</p>
      ) : results.length === 0 ? (
        <p className="banner">Aucun équipement ne correspond à votre recherche.</p>
      ) : (
        <div className="grid">
          {results.map((e) => (
            <EquipmentCard key={e.id} equipment={e} available={isAvailable(e.id)}
              onReserve={user?.role === "student" ? reserve : undefined} />
          ))}
        </div>
      )}
    </section>
  );
}
