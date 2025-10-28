import { useState } from "react";

export const useReminders = () => {
  const [reminders, setReminders] = useState([
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
  ]);

  const addReminder = (title, description) => {
    if (!title.trim()) return;

    const newReminder = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim() || "",
      completed: false,
      priority: "Ninguna",
      date: null,
      time: null,
      location: null,
    };
    setReminders([newReminder, ...reminders]);
  };

  const toggleComplete = (id) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const updateReminderTitle = (id, newTitle) => {
    if (!newTitle.trim()) return;
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, title: newTitle.trim() } : r))
    );
  };

  const updateReminderDetails = (id, details) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, ...details } : r))
    );
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
