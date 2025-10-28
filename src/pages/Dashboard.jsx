import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "../components/SplashScreen";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useAuth();
  const [chatActive, setChatActive] = useState(false);

  // Definir la función de logout que manejará todo
  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Si estamos haciendo logout, mostramos el splash
  if (isLoggingOut) {
    return <SplashScreen />;
  }

  return (
    <>
      <Navbar showProfile={true} onLogout={handleLogout} />
      <div
        className={`dashboard-main-container ${
          chatActive ? "chat-active" : ""
        }`}
      >
        <Chat chatActive={chatActive} setChatActive={setChatActive} />
      </div>
    </>
  );
}
