import React from "react";
import { useReminders } from "../hooks/useReminders";
import NewReminderInput from "../components/NewReminderInput";
import ReminderItem from "../components/ReminderItem";
import "../styles/ReminderPage.css";

export default function ReminderPage() {
  const {
    reminders,
    pendingCount,
    addReminder,
    toggleComplete,
    deleteReminder,
    updateReminderTitle,
    updateReminderDetails,
  } = useReminders();

  return (
    <div className="reminders-app-container">
      <header className="app-header">
        <h2 className="list-title">Recordatorios</h2>
        <span className="pending-count">{pendingCount}</span>
      </header>

      <section className="reminders-list-section">
        <NewReminderInput addReminder={addReminder} />

        {reminders.length === 0 && (
          <p className="empty-state">No tienes recordatorios. ¡Añade uno!</p>
        )}

        {reminders.map((r) => (
          <ReminderItem
            key={r.id}
            reminder={r}
            toggleComplete={toggleComplete}
            deleteReminder={deleteReminder}
            updateReminderTitle={updateReminderTitle}
            updateReminderDetails={updateReminderDetails}
          />
        ))}
      </section>
    </div>
  );
}
