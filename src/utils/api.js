// src/utils/api.js

// URL base del backend
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/";

export async function apiFetch(url, options = {}) {
  // Obtener token desde localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    throw new Error("No hay token, inicia sesión");
  }

  // Limpiar barra inicial de la URL si existe
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;

  // Headers por defecto + Authorization + cualquier header extra
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  // Realizar fetch
  const res = await fetch(`${BASE_URL}${cleanUrl}`, {
    ...options,
    headers,
    // Convertir body a JSON si es objeto
    body:
      options.body && typeof options.body === "object"
        ? JSON.stringify(options.body)
        : options.body,
  });

  // Manejo de errores de autorización
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("No autorizado. Inicia sesión nuevamente.");
  }

  // Otros errores HTTP
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error en la petición: ${res.status} - ${errorText}`);
  }

  // Intentar parsear JSON, si falla devolver null
  try {
    return await res.json();
  } catch {
    return null;
  }
}
