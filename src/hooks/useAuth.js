import { useState, useEffect, useCallback } from "react";

import { API_URL } from "../utils/config";

export function useAuth() {
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

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      } else {
        return {
          success: false,
          message: data.message || "Email o contraseña incorrectos",
        };
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

  // Metodos para actualizar el perfil
  const updateUser = async (updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) return { success: false, message: "No autenticado" };

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      } else {
        return {
          success: false,
          message: data.message || "Error al actualizar perfil",
        };
      }
    } catch (err) {
      console.error("Update user failed:", err);
      return { success: false, message: "Error de conexión con el servidor." };
    }
  };

  const deleteUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return { success: false, message: "No autenticado" };

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.removeItem("token");
        setCurrentUser(null);
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          message: data.message || "Error al eliminar cuenta",
        };
      }
    } catch (err) {
      console.error("Delete user failed:", err);
      return { success: false, message: "Error de conexión con el servidor." };
    }
  };

  return {
    login,
    register,
    logout,
    currentUser,
    loading,
    updateUser,
    deleteUser,
  };
}
