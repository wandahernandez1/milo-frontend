import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { useGoogleEvents } from "../../hooks/useGoogleEvents";
import "../../styles/EventosPanel.css";

export default function EventosPanel() {
  const hoy = new Date();
  const startRange = new Date(
    hoy.getFullYear(),
    hoy.getMonth() - 6,
    1
  ).toISOString();
  const endRange = new Date(
    hoy.getFullYear(),
    hoy.getMonth() + 6,
    0
  ).toISOString();

  const { events, loading, fetchEvents, connected } = useGoogleEvents(
    startRange,
    endRange
  );

  const [ubicacion, setUbicacion] = useState(null);

  // 🌍 Obtener ubicación actual (y traducirla a ciudad)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            // 🔄 Llamada al servicio de OpenStreetMap
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await resp.json();

            // Intentamos tomar ciudad o pueblo, o región si no hay
            const ciudad =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state ||
              "Ubicación desconocida";

            setUbicacion(ciudad);
          } catch (err) {
            console.error("Error al obtener la ciudad:", err);
            setUbicacion("Ubicación no disponible");
          }
        },
        (err) => {
          console.warn("No se pudo obtener la ubicación:", err);
          setUbicacion("Ubicación no disponible");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      console.warn("Geolocalización no soportada por el navegador.");
      setUbicacion("No disponible");
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading)
    return <p className="eventos-loading">Cargando eventos de Google...</p>;

  if (!connected)
    return (
      <div className="eventos-no-conectado">
        <h3>No estás conectado con Google Calendar</h3>
        <p>Conectate desde la página del calendario.</p>
      </div>
    );

  return (
    <section className="eventos-section">
      <header className="eventos-header">
        <h1>Próximos Eventos</h1>
        <p>Tus eventos sincronizados desde Google Calendar</p>
        <button onClick={fetchEvents} className="reload-button">
          <FontAwesomeIcon
            icon={faRotateRight}
            style={{ marginRight: "6px" }}
          />
          Actualizar
        </button>
      </header>

      <div className="eventos-grid">
        {events.length > 0 ? (
          events.map((evento) => (
            <div className="evento-card" key={evento.id}>
              <div className="evento-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="evento-info">
                <h3>{evento.title || "Sin título"}</h3>
                <p className="evento-fecha">
                  <FontAwesomeIcon icon={faClock} />{" "}
                  {new Date(evento.start).toLocaleString("es-ES", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="evento-lugar">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                  {evento.location
                    ? evento.location
                    : ubicacion
                    ? ` ${ubicacion}`
                    : "Sin ubicación"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-eventos">No hay eventos próximos</p>
        )}
      </div>
    </section>
  );
}
