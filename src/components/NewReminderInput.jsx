// NewReminderInput.jsx
import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
export default function NewReminderInput({ addReminder }) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim()) {
      addReminder(title.trim(), "");
      setTitle("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="new-reminder-input">
      <IoIosAddCircleOutline className="add-icon" onClick={handleAdd} />
      <input
        type="text"
        placeholder="Nuevo recordatorio"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}
