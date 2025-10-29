import React, { useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const iconMap = {
  success: <FaCheckCircle className="icon success-icon" />,
  error: <FaTimesCircle className="icon error-icon" />,
  info: <FaInfoCircle className="icon info-icon" />,
  warning: <FaExclamationTriangle className="icon warning-icon" />,
};

export default function Message({
  message,
  type = "info",
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-message ${type}`}>
      <span className="toast-icon">{iconMap[type] || iconMap.info}</span>
      <span className="toast-text">{message}</span>
      <button
        className="close-btn"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        &times;
      </button>
    </div>
  );
}
