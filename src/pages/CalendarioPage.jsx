import React, { useState, useCallback, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import EventModal from "../components/chat/EventModal";
import { useGoogleEvents } from "../hooks/useGoogleEvents";
import { API_URL } from "../utils/config";
import "../styles/CalendarioPage.css";

const formatDayHeader = (arg) => arg.text.substring(0, 1).toUpperCase();

export default function CalendarioPage() {
  const today = new Date();

  const [connected, setConnected] = useState(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    return user?.googleConnected || false;
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const startDateRange = new Date(
    today.getFullYear(),
    today.getMonth() - 12,
    1
  ).toISOString();
  const endDateRange = new Date(
    today.getFullYear(),
    today.getMonth() + 12,
    0
  ).toISOString();

  const {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
  } = useGoogleEvents(startDateRange, endDateRange);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true") {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : {};
      user.googleConnected = true;
      localStorage.setItem("user", JSON.stringify(user));
      setConnected(true);
      fetchEvents();
    }
  }, [fetchEvents]);

  const handleDateClick = (info) => {
    setSelectedEvent({
      startStr: info.dateStr,
      endStr: info.dateStr,
      title: "",
    });
    setOpenModal(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setOpenModal(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (!eventData.startStr) {
        alert("El evento debe tener una fecha de inicio válida.");
        return;
      }

      if (selectedEvent && selectedEvent.id) {
        await updateEvent(selectedEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }

      await fetchEvents();
      setOpenModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("❌ Error al guardar el evento:", error);
      alert(
        `No se pudo guardar el evento en Google Calendar.\n${error.message}`
      );
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const handleConnectGoogle = useCallback(async () => {
    const userString = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const user = userString ? JSON.parse(userString) : null;

    if (!user || !token) {
      alert("Primero debes iniciar sesión.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/google/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok)
        throw new Error(`Error ${res.status} al obtener la URL de Google.`);

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No se recibió URL de Google:", data);
      }
    } catch (err) {
      console.error("Error iniciando conexión con Google:", err);
    }
  }, []);

  if (loading)
    return <p className="calendar-loading"> Cargando eventos de Google...</p>;

  if (!connected)
    return (
      <div className="calendar-not-connected">
        <h2>🔗 Conecta tu Google Calendar</h2>
        <p>
          Vincula tu cuenta de Google para sincronizar y gestionar tus eventos
          desde aquí.
        </p>
        <button onClick={handleConnectGoogle}>
          <i className="fab fa-google"></i> Conectar con Google Calendar
        </button>
      </div>
    );

  return (
    <div className="calendar-wrapper">
      <div className="calendar-main-layout">
        <div className="calendar-main-view">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
            }}
            height="auto"
            events={events}
            locale={esLocale}
            editable={true}
            selectable={true}
            dayHeaderContent={formatDayHeader}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            timeZone="America/Argentina/Buenos_Aires"
            eventDisplay="block"
            dayMaxEvents={3}
            moreLinkText="más"
          />
        </div>
      </div>

      <EventModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={async (id) => {
          try {
            await deleteEvent(id);
            await fetchEvents();
            handleCloseModal();
          } catch (err) {
            console.error(" Error eliminando evento:", err);
            alert("No se pudo eliminar el evento en Google Calendar.");
          }
        }}
        event={
          selectedEvent
            ? {
                id: selectedEvent.id,
                title: selectedEvent.title,
                startStr: selectedEvent.startStr,
                endStr: selectedEvent.endStr,
              }
            : null
        }
      />
    </div>
  );
}
