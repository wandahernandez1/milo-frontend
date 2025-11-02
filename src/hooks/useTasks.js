import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api.js";
import { useAuth } from "../context/AuthContext";

export function useTasks() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await apiFetch("tasks");
      setTasks(data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task) => {
    try {
      const newTask = await apiFetch("tasks", {
        method: "POST",
        body: JSON.stringify(task),
      });
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error("Error al crear tarea:", error);
      return false;
    }
  };

  const updateTask = async (id, task) => {
    try {
      const updated = await apiFetch(`tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(task),
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      return false;
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiFetch(`tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      return false;
    }
  };

  // Cargar tareas cuando hay usuario
  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    } else {
      setTasks([]); // limpia cuando no hay usuario
    }
  }, [currentUser]);

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask };
}
