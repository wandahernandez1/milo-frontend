import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SplashScreen from "./SplashScreen";

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Mientras verificamos token, mostramos splash
  if (loading) return <SplashScreen />;

  // Si no hay usuario, redirigimos al login
  if (!currentUser) return <Navigate to="/login" replace />;

  return children;
}
