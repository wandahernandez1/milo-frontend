import React, { useState } from "react";
import { IoIosTrash, IoIosCloseCircleOutline } from "react-icons/io";

export default function ReminderDetailsModal({
  reminder,
  onClose,
  onDelete,
  onUpdateDetails,
}) {
  // Estados para los campos de configuración
  const [title, setTitle] = useState(reminder.title);
  const [priority, setPriority] = useState(reminder.priority);
  const [date, setDate] = useState(reminder.date || "");
  const [time, setTime] = useState(reminder.time || "");
  const [location, setLocation] = useState(reminder.location || "");

  // Función para guardar los cambios
  const handleSave = () => {
    const updatedDetails = {
      title: title.trim(),
      priority,
      date: date || null,
      time: time || null,
      location: location.trim() || null,
    };

    if (!title.trim()) {
      alert("El título no puede estar vacío.");
      return;
    }

    onUpdateDetails(reminder.id, updatedDetails);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Configurar Recordatorio</h2>
          <button className="modal-close-button" onClick={onClose}>
            <IoIosCloseCircleOutline />
          </button>
        </header>

        <section className="modal-body">
          {/* Título del Recordatorio */}
          <div className="modal-section title-section">
            <input
              type="text"
              className="apple-input large"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
            />
          </div>

          {/* Sección de Fecha y Hora */}
          <div className="modal-section date-time-section">
            <h3>Fecha y Hora</h3>
            <input
              type="date"
              className="apple-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time"
              className="apple-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            {(date || time) && (
              <button
                className="clear-button"
                onClick={() => {
                  setDate("");
                  setTime("");
                }}
              >
                <IoIosTrash /> Borrar Fecha/Hora
              </button>
            )}
          </div>

          {/* Sección de Ubicación */}
          <div className="modal-section location-section">
            <h3>Ubicación</h3>
            <input
              type="text"
              className="apple-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Tienda, Trabajo, Casa"
            />
            {location && (
              <button className="clear-button" onClick={() => setLocation("")}>
                <IoIosTrash /> Borrar Ubicación
              </button>
            )}
          </div>

          <div className="modal-section priority-section">
            <h3>Prioridad</h3>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="apple-select"
            >
              <option value="Ninguna">Ninguna</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <div className="modal-section">
            <h3>Imagen</h3>
            <p className="placeholder-detail">Añadir una foto.</p>
          </div>
        </section>

        <footer className="modal-footer">
          <button
            className="modal-button delete"
            onClick={() => {
              onDelete(reminder.id);
              onClose();
            }}
          >
            <IoIosTrash />
          </button>
          <button className="modal-button save" onClick={handleSave}>
            Guardar
          </button>
          <button className="modal-button cancel" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
