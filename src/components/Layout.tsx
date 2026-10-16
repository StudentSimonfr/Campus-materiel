import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import { ROLE_LABEL } from "../data/libelles";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

export default function Layout() {
  const { user, logout, notice, setNotice, storageError } = useApp();
  const navigate = useNavigate();
  useKeyboardNavigation();

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice, setNotice]);

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  return (
    <>
      <header className="header">
        <strong className="brand">Campus Matériel</strong>
        {user && (
          <nav aria-label="Navigation principale">
            <NavLink to="/catalogue">Catalogue</NavLink>
            {user.role === "student" && <NavLink to="/mes-reservations">Mes réservations</NavLink>}
            {user.role === "manager" && <NavLink to="/gestion">Gestion</NavLink>}
          </nav>
        )}
        {user && (
          <div className="user">
            <span>{user.nom} ({ROLE_LABEL[user.role]})</span>
            <button className="btn secondary" onClick={handleLogout}>Déconnexion</button>
          </div>
        )}
      </header>
      {storageError && (
        <div className="banner error" role="alert">
          Problème avec le stockage du navigateur (localStorage) : vos données risquent de ne pas être conservées.
        </div>
      )}
      <main className="container"><Outlet /></main>
      <div className="toast-zone" role="status" aria-live="polite">
        {notice && <div key={notice.key} className={`toast ${notice.type}`}>{notice.text}</div>}
      </div>
    </>
  );
}
