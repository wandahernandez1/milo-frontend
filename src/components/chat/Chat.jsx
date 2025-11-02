import React, { useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ActionCards from "./ActionCards";
import { useChatLogic } from "../../hooks/useChatLogic";
import miloAvatar from "../../assets/milo2.jpg";
import "../../styles/dashboard.css";

export default function Chat({ chatActive, setChatActive }) {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    handleSend,
    handleCardClick,
    handleMinimize,
  } = useChatLogic(setChatActive);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatActive) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatActive]);

  return (
    <section className="chat-section">
      {!chatActive && (
        <div className="chat-initial-content">
          <div className="intro-section-wrapper">
            <section className="intro-section">
              <img src={miloAvatar} alt="Milo Avatar" className="milo-avatar" />
              <h1>
                Hola, soy <span className="highlight">Milo,</span> tu asistente
                personal.
              </h1>
              <p className="question">¿Qué te gustaría hacer hoy?</p>
            </section>
          </div>
          <ActionCards handleCardClick={handleCardClick} />
        </div>
      )}

      {chatActive && (
        <>
          <div className="chat-header">
            <div className="chat-header-info">
              <img src={miloAvatar} alt="Milo" className="chat-header-avatar" />
              <div className="chat-header-text">
                <h3>Milo Assistant</h3>
                <span className="chat-status">En línea</span>
              </div>
            </div>
            <button
              className="close-chat-button"
              onClick={handleMinimize}
              title="Cerrar chat"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} msg={msg} />
            ))}
            {isLoading && (
              <div className="chat-message-container milo">
                <div className="chat-avatar">
                  <img src={miloAvatar} alt="Milo" className="milo-chat-img" />
                </div>
                <div className="chat-bubble milo-bubble thinking-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span style={{ marginLeft: "8px" }}>
                    Milo está pensando...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </>
      )}

      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={handleSend}
        onMinimize={handleMinimize}
      />
    </section>
  );
}
