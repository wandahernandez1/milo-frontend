import React from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ msg }) {
  const navigate = useNavigate();

  return (
    <div className={`chat-message ${msg.sender}`}>
      <div className="prose prose-invert max-w-none">
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
                    : () => btn.route && navigate(btn.route)
                }
              >
                {btn.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
