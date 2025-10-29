import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const API_URL = "http://localhost:3000/api";
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
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
  }, [fetchUser]);
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (err) {
        console.warn("No se pudo parsear JSON del error", err);
      }

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      } else {
        // Si el backend no envía message, usamos un default
        const message = data?.message || "Email o contraseña incorrectos";
        return { success: false, message };
      }
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, message: "Error de conexión con el servidor." };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      } else {
        return {
          success: false,
          message: data.message || "Error al registrar",
        };
      }
    } catch (err) {
      console.error("Register failed:", err);
      return { success: false, message: err.message || "Error de conexión." };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return { login, register, logout, currentUser, loading };
}
