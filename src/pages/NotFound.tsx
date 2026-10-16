import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section>
      <h1>404 — Page introuvable</h1>
      <p>Cette adresse n'existe pas.</p>
      <Link className="btn" to="/">Retour à l'accueil</Link>
    </section>
  );
}
