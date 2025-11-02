// src/utils/api.js
import { API_URL as BASE_URL } from "./config"; // usa el archivo que creamos

// Normaliza para que no duplique ni falte barra
function joinUrl(base, path) {
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}/${cleanPath}`;
}

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  if (!token) {
    // si no hay token, no redirigir automáticamente en util (dejar al caller si quiere)
    throw new Error("No hay token");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(joinUrl(BASE_URL, url), {
    ...options,
    headers,
    body:
      options.body && typeof options.body === "object"
        ? JSON.stringify(options.body)
        : options.body,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw new Error("No autorizado");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status} - ${text}`);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

// helper para llamadas que no necesitan token (ej: endpoints públicos o login)
export async function publicFetch(url, options = {}) {
  const res = await fetch(joinUrl(BASE_URL, url), options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status} - ${text}`);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}
