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
  const API_URL = "http://localhost:3000/api";
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
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
      console.error(err);
      localStorage.removeItem("token");
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
        return { success: true, user: data.user };
      }
      return { success: false, message: data?.message || "Error de login" };
    } catch {
      return { success: false, message: "Error de conexión" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    setCurrentUser(null);
    setIsLoggingOut(false);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, login, logout, isLoggingOut }}
    >
      <MessageProvider>{children}</MessageProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
