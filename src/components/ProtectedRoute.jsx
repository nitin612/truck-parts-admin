import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-sm text-gray-500">Loading…</div>;
  if (!user || !user.isAdmin) return <Navigate to="/login" replace />;
  return children;
}
