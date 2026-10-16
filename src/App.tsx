import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import { useApp } from "./context/useApp";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Catalogue from "./pages/Catalogue";
import EquipmentDetail from "./pages/EquipmentDetail";
import MyReservations from "./pages/MyReservations";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

// Chargement à la demande (lazy) de l'espace de gestion
const Gestion = lazy(() => import("./pages/gestion/Gestion"));
const EquipmentFormPage = lazy(() => import("./pages/gestion/EquipmentFormPage"));

function Home() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "manager" ? "/gestion" : "/catalogue"} replace />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<p className="container">Chargement…</p>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/acces-refuse" element={<AccessDenied />} />
              <Route path="/catalogue" element={<ProtectedRoute><Catalogue /></ProtectedRoute>} />
              <Route path="/materiels/:id" element={<ProtectedRoute><EquipmentDetail /></ProtectedRoute>} />
              <Route path="/mes-reservations" element={<ProtectedRoute role="student"><MyReservations /></ProtectedRoute>} />
              <Route path="/gestion" element={<ProtectedRoute role="manager"><Gestion /></ProtectedRoute>} />
              <Route path="/gestion/nouveau" element={<ProtectedRoute role="manager"><EquipmentFormPage /></ProtectedRoute>} />
              <Route path="/gestion/:id/modifier" element={<ProtectedRoute role="manager"><EquipmentFormPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}
