import { useState, useEffect, useCallback } from "react";

import { API_URL, TIME_ZONE } from "../utils/config";

export const useGoogleEvents = (timeMin, timeMax) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const TIME_ZONE = "America/Argentina/Buenos_Aires";

  const fetchEvents = useCallback(async () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!timeMin || !timeMax) {
      setConnected(false);
      setLoading(false);
      setEvents([]);
      return;
    }

    if (!token || !user || !user.googleConnected) {
      setConnected(false);
      setLoading(false);
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const timeMinISO = new Date(timeMin).toISOString();
      const timeMaxISO = new Date(timeMax).toISOString();

      const res = await fetch(
        `${API_URL}/google/events?timeMin=${encodeURIComponent(
          timeMinISO
        )}&timeMax=${encodeURIComponent(timeMaxISO)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errorMessage = `Error ${res.status} al obtener eventos`;

        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
          console.error("❌ Respuesta del servidor:", res.status, errorData);
        } catch (jsonError) {
          const errorText = await res.text();
          console.error("❌ Respuesta del servidor:", res.status, errorText);
        }

        if (res.status === 401) {
          const userString = localStorage.getItem("user");
          if (userString) {
            try {
              const user = JSON.parse(userString);
              user.googleConnected = false;
              localStorage.setItem("user", JSON.stringify(user));
            } catch (e) {
              console.error("Error actualizando estado de usuario:", e);
            }
          }
          setConnected(false);
          throw new Error(
            "Tu sesión de Google Calendar expiró. Por favor, reconecta tu cuenta."
          );
        }

        throw new Error(errorMessage);
      }

      const data = await res.json();

      const formatted = data.map((event) => ({
        id: event.id,
        title: event.summary,
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        description: event.description || "",
      }));

      setEvents(formatted);
      setConnected(true);
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === "AbortError") {
        console.error("⏱️ Timeout al cargar eventos de Google Calendar");
        setError("La carga de eventos tardó demasiado. Intenta nuevamente.");
      } else {
        console.error("❌ Error obteniendo eventos:", err.message || err);
        setError(err.message || "Error al obtener eventos");
      }

      setEvents([]);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [token, timeMin, timeMax]);

  useEffect(() => {
    if (timeMin && timeMax) {
      fetchEvents();
    } else {
      setEvents([]);
      setLoading(false);
      setConnected(false);
    }
  }, [fetchEvents]);

  const createEvent = useCallback(
    async (eventData) => {
      if (!token) return;

      const startStr = eventData.startStr || "";
      const endStr = eventData.endStr || "";
      const isAllDay = eventData.isAllDay;

      const dateOnlyStart = startStr.slice(0, 10);
      const dateOnlyEnd = endStr.slice(0, 10);

      const googleEventPayload = {
        summary: eventData.title,

        start: isAllDay
          ? { date: dateOnlyStart }
          : startStr
          ? { dateTime: startStr, timeZone: TIME_ZONE }
          : null,

        end: isAllDay
          ? { date: dateOnlyEnd }
          : endStr
          ? { dateTime: endStr, timeZone: TIME_ZONE }
          : null,
      };

      if (!googleEventPayload.start || !googleEventPayload.end) {
        throw new Error("Fechas de inicio o fin no válidas.");
      }

      try {
        const res = await fetch(`${API_URL}/google/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(googleEventPayload),
        });

        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(
            `Error ${res.status} al crear evento: ${
              errorBody.message || JSON.stringify(errorBody)
            }`
          );
        }

        const created = await res.json();
        await fetchEvents();
        return created;
      } catch (err) {
        console.error("Error creando evento:", err);
        throw err;
      }
    },
    [token, fetchEvents]
  );

  const updateEvent = useCallback(
    async (eventId, eventData) => {
      if (!token) return;

      const startStr = eventData.startStr || "";
      const endStr = eventData.endStr || "";
      const isAllDay = eventData.isAllDay;

      const dateOnlyStart = startStr.slice(0, 10);
      const dateOnlyEnd = endStr.slice(0, 10);

      const googleEventPayload = {
        summary: eventData.title,
        start: isAllDay
          ? { date: dateOnlyStart }
          : startStr
          ? { dateTime: startStr, timeZone: TIME_ZONE }
          : null,
        end: isAllDay
          ? { date: dateOnlyEnd }
          : endStr
          ? { dateTime: endStr, timeZone: TIME_ZONE }
          : null,
      };

      if (!googleEventPayload.start || !googleEventPayload.end) {
        throw new Error("Fechas de inicio o fin no válidas.");
      }

      try {
        const res = await fetch(`${API_URL}/google/events/${eventId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(googleEventPayload),
        });

        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(
            `Error ${res.status} al actualizar evento: ${
              errorBody.message || JSON.stringify(errorBody)
            }`
          );
        }

        const updated = await res.json();
        await fetchEvents();
        return updated;
      } catch (err) {
        console.error("Error actualizando evento:", err);
        throw err;
      }
    },
    [token, fetchEvents]
  );

  const deleteEvent = useCallback(
    async (eventId) => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/google/events/${eventId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Error ${res.status} al eliminar evento.`);

        await fetchEvents();
      } catch (err) {
        console.error("Error eliminando evento:", err);
        throw err;
      }
    },
    [token, fetchEvents]
  );

  return {
    events,
    loading,
    connected,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
