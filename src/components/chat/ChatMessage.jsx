import React from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import miloAvatar from "../../assets/milo2.jpg";

export default function ChatMessage({ msg }) {
  const navigate = useNavigate();
  const isUser = msg.sender === "user";

  return (
    <div className={`chat-message-container ${msg.sender}`}>
      {!isUser && (
        <div className="chat-avatar milo-avatar-bubble">
          <img src={miloAvatar} alt="Milo" className="milo-chat-img" />
        </div>
      )}
      {/* Burbuja del mensaje */}
      <div className={`chat-bubble ${msg.sender}-bubble`}>
        <div className="prose prose-invert max-w-none message-content">
          {msg.isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
          ) : (
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          )}
        </div>

        {/* Botones dinámicos */}
        {msg.buttons && (
          <div className="chat-buttons-container">
            {(Array.isArray(msg.buttons) ? msg.buttons : [msg.buttons]).map(
              (btn, i) => (
                <button
                  key={i}
                  className="chat-dynamic-button"
                  onClick={
                    btn.onClick
                      ? btn.onClick
                      : () => btn.route && navigate(btn.route, btn.state)
                  }
                >
                  {btn.label}
                </button>
              )
            )}
          </div>
        )}

        <small className="message-timestamp">
          {new Date(msg.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </small>
      </div>
    </div>
  );
}
