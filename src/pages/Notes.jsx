// src/components/Notes.jsx
import { useState } from "react";
import { useNotes } from "../hooks/useNotes.js";
import "../styles/notes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Notes() {
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();

  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showMessage = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      showMessage("El título y el contenido no pueden estar vacíos.", "error");
      return;
    }

    const note = { title, content };
    let success;

    if (editingId) {
      success = await updateNote(editingId, note);
      showMessage(
        success ? "Nota actualizada" : "Error al actualizar",
        success ? "success" : "error"
      );
    } else {
      success = await createNote(note);
      showMessage(
        success ? "Nota creada" : "Error al crear",
        success ? "success" : "error"
      );
    }

    if (success) {
      setShowInput(false);
      setTitle("");
      setContent("");
      setEditingId(null);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setShowInput(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar esta nota?")) return;
    const success = await deleteNote(id);
    showMessage(
      success ? "Nota eliminada" : "Error al eliminar",
      success ? "info" : "error"
    );
  };

  return (
    <section className="notes-section">
      <div className="section-header">
        <h2>Tus Notas</h2>
        <button className="new-note-button" onClick={() => setShowInput(true)}>
          <FontAwesomeIcon icon={faPlus} /> Nueva nota
        </button>
      </div>

      {showInput && (
        <div className="note-input-card">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Escribe tu nota..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="note-actions">
            <button
              className="cancel-button"
              onClick={() => setShowInput(false)}
            >
              Cancelar
            </button>
            <button className="save-button" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      )}

      <h2 className="notes-list-title">Notas Guardadas</h2>
      <div className="notes-list-container">
        {loading ? (
          <p className="empty-notes">Cargando notas...</p>
        ) : notes.length === 0 ? (
          <p className="empty-notes">Aún no tienes notas. ¡Crea una!</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="note-item-card">
              <div className="note-item-content">
                <h3>{note.title}</h3>
                <pre>{note.content}</pre>
              </div>
              <div className="note-item-actions">
                <button
                  className="icon-button edit-button"
                  onClick={() => handleEdit(note)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="icon-button delete-button"
                  onClick={() => handleDelete(note.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {toast.message && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </section>
  );
}
