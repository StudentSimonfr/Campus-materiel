import { Link } from "react-router-dom";
export default function AccessDenied() {
  return (
    <section>
      <h1>Accès refusé</h1>
      <p className="banner error">Votre rôle ne vous permet pas d'accéder à cette page.</p>
      <Link className="btn" to="/">Retour à l'accueil</Link>
    </section>
  );
}
