import React from "react";

export default function ChatInput({
  inputValue,
  setInputValue,
  onSend,
  onMinimize,
}) {
  return (
    <div className="chat-input-container">
      <input
        type="text"
        placeholder="Escribe tu mensaje..."
        className="chat-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
      />
      <button className="send-button" onClick={onSend} title="Enviar mensaje">
        <i className="fas fa-paper-plane"></i>
      </button>
    </div>
  );
}
