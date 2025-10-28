import { useState } from "react";
import { useTasks } from "../hooks/useTasks.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../styles/Tasks.css";

export default function Tasks() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showMessage = (msg, type = "info") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleSave = async () => {
    if (!title.trim()) return showMessage("El título es obligatorio", "error");
    let success;

    if (editingId) {
      const taskUpdate = { title, description };
      success = await updateTask(editingId, taskUpdate);
      showMessage(
        success ? "Tarea actualizada" : "Error al actualizar",
        success ? "success" : "error"
      );
    } else {
      const newTask = { title, description, completed: false };
      success = await createTask(newTask);
      showMessage(
        success ? "Tarea creada" : "Error al crear",
        success ? "success" : "error"
      );
    }
    if (success) {
      setShowInput(false);
      setTitle("");
      setDescription("");
      setEditingId(null);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setShowInput(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar esta tarea?")) return;
    const success = await deleteTask(id);
    showMessage(
      success ? "Tarea eliminada" : "Error al eliminar la tarea",
      success ? "info" : "error"
    );
  };

  const toggleComplete = async (task) => {
    const success = await updateTask(task.id, { completed: !task.completed });
    showMessage(
      success ? "Estado actualizado" : "Error al cambiar estado",
      success ? "info" : "error"
    );
  };

  return (
    <section className="tasks-section">
      <div className="section-header">
        <h2>Tus Tareas</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setTitle("");
            setDescription("");
            setShowInput(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Nueva tarea
        </button>
      </div>
      {showInput && (
        <div className="task-input-card">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (obligatorio)"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
          />
          <div>
            <button
              onClick={() => {
                setShowInput(false);
                setTitle("");
                setDescription("");
                setEditingId(null);
              }}
            >
              Cancelar
            </button>
            <button onClick={handleSave}>
              {editingId ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      )}
      <div className="tasks-list-container">
        {loading ? (
          <p>Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p>No hay tareas aún. ¡Crea una!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item-card ${task.completed ? "completed" : ""}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
              <div className="task-content">
                <h3
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </h3>
                {task.description && <p>{task.description}</p>}
              </div>
              <div className="task-actions">
                <button
                  className="icon-button edit-button"
                  onClick={() => handleEdit(task)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="icon-button delete-button"
                  onClick={() => handleDelete(task.id)}
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
