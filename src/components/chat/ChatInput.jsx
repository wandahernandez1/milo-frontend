import React from "react";

export default function ChatInput({
  inputValue,
  setInputValue,
  onSend,
  onMinimize,
}) {
  const handleSendClick = () => {
    if (inputValue?.trim()) {
      onSend();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue?.trim()) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        placeholder="Escribe tu mensaje..."
        className="chat-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="send-button"
        onClick={handleSendClick}
        title="Enviar mensaje"
      >
        <i className="fas fa-paper-plane"></i>
      </button>
    </div>
  );
}
