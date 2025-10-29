// src/hooks/useMessages.js
import { useState, useCallback } from "react";
const DURATION = 4000;

export function useMessages() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [timerId, setTimerId] = useState(null);

  const hideMessage = useCallback(() => {
    setMessage("");
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  }, [timerId]);

  const showMessage = (msg, msgType = "info") => {
    if (timerId) {
      clearTimeout(timerId);
    }
    setMessage(msg);
    setType(msgType);
    const newTimerId = setTimeout(() => {
      setMessage("");
      setTimerId(null);
    }, DURATION);

    setTimerId(newTimerId);
  };

  return { message, type, showMessage, hideMessage };
}
