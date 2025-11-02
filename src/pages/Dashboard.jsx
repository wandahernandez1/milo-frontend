import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/NavBar";
import Chat from "../components/chat/Chat";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "../components/layout/SplashScreen";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useAuth();
  const [chatActive, setChatActive] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    //  Revisamos si hay flag en sessionStorage
    const skipSplash = sessionStorage.getItem("skipDashboardSplash") === "true";

    if (skipSplash) {
      setShowSplash(false);
      sessionStorage.removeItem("skipDashboardSplash");
    } else {
      const timer = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  if (isLoggingOut || showSplash) return <SplashScreen show={true} />;

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
