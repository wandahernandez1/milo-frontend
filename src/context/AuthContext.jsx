import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { MessageProvider } from "./MessageContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Obtener usuario desde backend
  const fetchUser = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      const userString = localStorage.getItem("user");
      setCurrentUser(userString ? JSON.parse(userString) : null);
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
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Error en fetchUser:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // useEffect: cargar usuario al montar
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Login con email y password
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
        localStorage.setItem("user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }

      return { success: false, message: data.message || "Error de login" };
    } catch {
      return { success: false, message: "Error de conexión con el servidor" };
    } finally {
      setLoading(false);
    }
  };

  // Login con Google (idToken)
  const loginWithGoogle = async (googleToken) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/google/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }

      return {
        success: false,
        message: data.message || "Error en login con Google",
      };
    } catch (err) {
      console.error("Error en loginWithGoogle:", err);
      return { success: false, message: "Error de conexión con el servidor" };
    } finally {
      setLoading(false);
    }
  };

  // Login usando JWT ya existente (por si se guarda en localStorage)
  const loginWithJwt = async (jwtToken) => {
    setLoading(true);
    try {
      localStorage.setItem("token", jwtToken);
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (res.ok) {
        const user = await res.json();
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        return { success: true, user };
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { success: false, message: "Token inválido" };
    } catch (err) {
      console.error("Error loginWithJwt:", err);
      return { success: false, message: "Error de conexión con el servidor" };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsLoggingOut(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        loginWithGoogle,
        loginWithJwt,
        logout,
        isLoggingOut,
      }}
    >
      <MessageProvider>{children}</MessageProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
