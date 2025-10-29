import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import SplashScreen from "../components/SplashScreen";
import { MessageProvider } from "./MessageContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = "http://localhost:3000/api";
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

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
      console.error("Error al obtener usuario:", err);
      localStorage.removeItem("token");
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUser();
    const splashDelay = setTimeout(() => setShowSplash(false), 3000); // splash 3s
    return () => clearTimeout(splashDelay);
  }, [fetchUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        setCurrentUser(data.user);

        setShowSplash(true);
        setTimeout(() => {
          setShowSplash(false);
        }, 2500);

        return { success: true, user: data.user };
      }

      return { success: false, message: data?.message || "Error de login" };
    } catch (err) {
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
      <MessageProvider>
        {showSplash || loading ? (
          <SplashScreen show={true} onFinish={() => setShowSplash(false)} />
        ) : (
          children
        )}
      </MessageProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
