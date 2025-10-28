import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import SplashScreen from "../components/SplashScreen";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = "http://localhost:3000/api";
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // indica si estamos verificando token
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Verifica token y obtiene usuario
  const fetchUser = useCallback(async () => {
    setLoading(true);
    const MIN_SPLASH_TIME = 1500; // tiempo mínimo visible del splash
    const start = Date.now();

    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
      const elapsed = Date.now() - start;
      const remaining = MIN_SPLASH_TIME - elapsed;
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
      } else {
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Error al obtener usuario:", err);
      localStorage.removeItem("token");
      setCurrentUser(null);
    } finally {
      const elapsed = Date.now() - start;
      const remaining = MIN_SPLASH_TIME - elapsed;
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        setCurrentUser(data.user);

        // Pequeño delay visual para transición suave
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return { success: true, user: data.user };
      } else {
        return {
          success: false,
          message: data.message || "Credenciales incorrectas",
        };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Error de conexión con el servidor." };
    } finally {
      setLoading(false);
    }
  };

  //  LOGOUT
  const logout = async () => {
    setIsLoggingOut(true);
    setLoading(true);

    // Delay leve para animación de salida del splash
    await new Promise((resolve) => setTimeout(resolve, 300));

    localStorage.removeItem("token");
    setCurrentUser(null);

    setIsLoggingOut(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, login, logout, isLoggingOut }}
    >
      {loading ? <SplashScreen /> : children}
    </AuthContext.Provider>
  );
};
// Hook de acceso rápido
export const useAuth = () => useContext(AuthContext);
