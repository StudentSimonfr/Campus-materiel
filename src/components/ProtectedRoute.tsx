import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/useApp";
import type { Role } from "../data/donnees-initiales";

// Non connecté -> /login ; mauvais rôle -> /acces-refuse. Valable aussi pour une URL saisie à la main.
export default function ProtectedRoute({ role, children }: { role?: Role; children: ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/acces-refuse" replace />;
  return <>{children}</>;
}
