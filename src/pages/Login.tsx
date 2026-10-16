import { useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import { ROLE_LABEL } from "../data/libelles";

export default function Login() {
  const { users, login } = useApp();
  const navigate = useNavigate();
  const choose = (id: number) => { login(id); navigate("/", { replace: true }); };
  return (
    <section>
      <h1>Connexion</h1>
      <p className="muted">Connexion simulée : choisissez un compte de démonstration.</p>
      <div className="grid">
        {users.map((u) => (
          <button key={u.id} className="card account" onClick={() => choose(u.id)}>
            <strong>{u.nom}</strong><span className="muted">{ROLE_LABEL[u.role]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
