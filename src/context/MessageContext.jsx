import { createContext, useContext, useState, useCallback } from "react";
import Message from "../components/Message";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const showMessage = useCallback((text, msgType = "info", duration = 4000) => {
    setMessage(text);
    setType(msgType);
    setTimeout(() => setMessage(""), duration);
  }, []);

  const hideMessage = useCallback(() => setMessage(""), []);

  return (
    <MessageContext.Provider
      value={{ message, type, showMessage, hideMessage }}
    >
      {children}
      <Message message={message} type={type} onClose={hideMessage} />
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
