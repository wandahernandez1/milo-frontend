import React, { useEffect, useState } from "react";
import miloAvatar from "../assets/milo-avatar.png";
import "../styles/SplashScreen.css";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 2;
        clearInterval(interval);
        return 100;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <img src={miloAvatar} alt="Milo" className="splash-logo" />
        <h1 className="splash-title">Milo Assistant</h1>
        <p className="splash-text">CARGANDO...</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
