import React, { useState, useEffect, useCallback } from "react";
import ConfirmDialog from "../common/ConfirmDialog.jsx";

export default function EventModal({ open, onClose, onSave, onDelete, event }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (event) {
      const formatForInput = (dateData) => {
        let str = "";
        if (typeof dateData === "string") {
          str = dateData;
        } else if (dateData?.dateTime) {
          str = dateData.dateTime;
        } else if (dateData?.date) {
          str = dateData.date;
        }

        if (!str) return "";

        if (str.includes("T") && str.length > 10) {
          return str.slice(0, 16);
        }

        if (str.length === 10) {
          return str + "T00:00";
        }
        return "";
      };

      const startData = event.startStr || event.start;
      const endData = event.endStr || event.end;

      setTitle(event.summary || event.title || "");

      const initialStart = formatForInput(startData);
      setStart(initialStart);

      const initialEnd = endData ? formatForInput(endData) : initialStart;
      setEnd(initialEnd);
    } else {
      setTitle("");
      setStart("");
      setEnd("");
    }
  }, [event]);

  const handleSave = () => {
    if (!title || !start) {
      alert("El título y la fecha de inicio son obligatorios.");
      return;
    }

    try {
      const startDT = new Date(start);

      const isAllDay = start.endsWith("T00:00");

      let endDT;

      if (isAllDay) {
        endDT = new Date(startDT.getTime() + 24 * 60 * 60 * 1000);
      } else if (end) {
        endDT = new Date(end);
      } else {
        endDT = new Date(startDT.getTime() + 60 * 60 * 1000);
      }

      if (!isAllDay && endDT <= startDT) {
        endDT = new Date(startDT.getTime() + 60 * 60 * 1000);
      }

      const eventData = {
        title,
        startStr: startDT.toISOString(),
        endStr: endDT.toISOString(),
        isAllDay: isAllDay,
      };

      onSave(eventData);
    } catch (err) {
      alert("Error: la fecha seleccionada no es válida.");
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>{event?.id ? "Editar evento" : "Nuevo evento"}</h3>

          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Reunión de equipo"
          />

          <label htmlFor="start">Inicio</label>
          <input
            id="start"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />

          <label htmlFor="end">Fin</label>
          <input
            id="end"
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />

          <div className="modal-buttons">
            <button className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>

            {event?.id && (
              <button
                className="delete-btn"
                onClick={() => setShowConfirmDelete(true)}
              >
                Eliminar
              </button>
            )}

            <button className="save-btn" onClick={handleSave}>
              {event?.id ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => {
          onDelete(event.id);
          setShowConfirmDelete(false);
        }}
        title="Eliminar evento"
        message="¿Estás seguro de que querés eliminar este evento de tu calendario?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  );
}
