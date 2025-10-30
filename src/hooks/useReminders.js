import { useState, useEffect } from "react";

export const useReminders = () => {
  const defaultReminders = [
    {
      id: 1,
      title: "Llamar al médico",
      description: "Pedir cita para el chequeo anual",
      completed: false,
      priority: "Ninguna",
      date: null,
      time: null,
      location: null,
    },
    {
      id: 2,
      title: "Comprar leche y huevos",
      description: "Supermercado antes de las 5pm",
      completed: true,
      priority: "Alta",
      date: "2025-10-30",
      time: "14:30",
      location: "Tienda principal",
    },
  ];

  const [reminders, setReminders] = useState([]);

  // Cargar recordatorios desde localStorage o usar los por defecto
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reminders") || "null");
    if (stored && stored.length > 0) {
      setReminders(stored);
    } else {
      setReminders(defaultReminders);
      localStorage.setItem("reminders", JSON.stringify(defaultReminders));
    }
  }, []);

  const saveToStorage = (updatedReminders) => {
    setReminders(updatedReminders);
    localStorage.setItem("reminders", JSON.stringify(updatedReminders));
  };

  const addReminder = (title, description) => {
    if (!title.trim()) return;

    const newReminder = {
      id: Date.now(),
      title: title.trim(),
      description: description?.trim() || "",
      completed: false,
      priority: "Ninguna",
      date: null,
      time: null,
      location: null,
    };

    saveToStorage([newReminder, ...reminders]);
  };

  const toggleComplete = (id) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    saveToStorage(updated);
  };

  const deleteReminder = (id) => {
    const updated = reminders.filter((r) => r.id !== id);
    saveToStorage(updated);
  };

  const updateReminderTitle = (id, newTitle) => {
    if (!newTitle.trim()) return;
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, title: newTitle.trim() } : r
    );
    saveToStorage(updated);
  };

  const updateReminderDetails = (id, details) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, ...details } : r
    );
    saveToStorage(updated);
  };

  const pendingCount = reminders.filter((r) => !r.completed).length;

  return {
    reminders,
    pendingCount,
    addReminder,
    toggleComplete,
    deleteReminder,
    updateReminderTitle,
    updateReminderDetails,
  };
};
