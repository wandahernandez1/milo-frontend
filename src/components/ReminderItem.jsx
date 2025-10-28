import React, { useState } from "react";
import ReminderDetailsModal from "./ReminderDetailsModal";
import { IoIosCheckmark, IoIosMore, IoIosFlag } from "react-icons/io";

export default function ReminderItem({
  reminder,
  toggleComplete,
  deleteReminder,
  updateReminderTitle,
  updateReminderDetails,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(reminder.title);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDoubleClick = () => {
    if (!reminder.completed) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (editedTitle.trim() && editedTitle !== reminder.title) {
      updateReminderTitle(reminder.id, editedTitle.trim());
    } else if (!editedTitle.trim()) {
      setEditedTitle(reminder.title);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  const getPriorityIndicator = (priority) => {
    if (priority === "Ninguna" || !priority) return null;

    let className = "priority-flag";
    switch (priority) {
      case "Baja":
        className += " low";
        break;
      case "Media":
        className += " medium";
        break;
      case "Alta":
        className += " high";
        break;
      default:
        return null;
    }

    return <IoIosFlag className={className} />;
  };

  const formatDate = (date, time) => {
    if (!date) return null;

    let display = new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
    if (time) {
      display += ` ${time}`;
    }
    return <span className="reminder-info-chip date-chip">{display}</span>;
  };

  const displayLocation = (location) => {
    if (!location) return null;
    return <span className="reminder-info-chip location-chip">{location}</span>;
  };

  return (
    <>
      <div className={`reminder-item ${reminder.completed ? "completed" : ""}`}>
        <div
          className={`checkbox-circle ${reminder.completed ? "checked" : ""}`}
          onClick={() => toggleComplete(reminder.id)}
        >
          {reminder.completed && <IoIosCheckmark className="checkmark-icon" />}
        </div>

        <div className="reminder-content" onDoubleClick={handleDoubleClick}>
          {isEditing && !reminder.completed ? (
            <input
              type="text"
              className="edit-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          ) : (
            <>
              <span className="reminder-title">
                {getPriorityIndicator(reminder.priority)}
                {reminder.title}
              </span>

              <div className="reminder-details-chips">
                {formatDate(reminder.date, reminder.time)}
                {displayLocation(reminder.location)}
              </div>
            </>
          )}
        </div>

        <button
          className="icon-button options-button"
          onClick={() => setIsModalOpen(true)}
          disabled={reminder.completed}
        >
          <IoIosMore />
        </button>
      </div>

      {isModalOpen && (
        <ReminderDetailsModal
          reminder={reminder}
          onClose={() => setIsModalOpen(false)}
          onDelete={deleteReminder}
          onUpdateDetails={updateReminderDetails}
        />
      )}
    </>
  );
}
