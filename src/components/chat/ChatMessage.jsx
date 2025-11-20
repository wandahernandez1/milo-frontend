import React from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import miloAvatar from "../../assets/milo2.jpg";
import WeatherCard from "./WeatherCard";
import NewsCard from "../common/NewsCard";

export default function ChatMessage({ msg }) {
  const navigate = useNavigate();
  const isUser = msg.sender === "user";

  const messageText =
    typeof msg.text === "string"
      ? msg.text
      : msg.text?.reply ||
        msg.text?.message ||
        msg.text?.text ||
        "⚠️ Error al mostrar el mensaje";

  const isWeatherMessage = msg.text?.isWeather || msg.weatherData;
  const weatherData = msg.text?.weatherData || msg.weatherData;

  const isNewsMessage = msg.text?.isNews;
  const newsArticles = msg.text?.articles;

  return (
    <div className={`chat-message-container ${msg.sender}`}>
      {!isUser && (
        <div className="chat-avatar milo-avatar-bubble">
          <img src={miloAvatar} alt="Milo" className="milo-chat-img" />
        </div>
      )}

      <div className={`chat-bubble ${msg.sender}-bubble`}>
        {isWeatherMessage && weatherData ? (
          <WeatherCard weatherData={weatherData} />
        ) : isNewsMessage ? (
          <NewsCard articles={newsArticles} />
        ) : (
          <div className="prose prose-invert max-w-none message-content">
            {msg.isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: messageText }} />
            ) : (
              <ReactMarkdown>{messageText}</ReactMarkdown>
            )}
          </div>
        )}

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
