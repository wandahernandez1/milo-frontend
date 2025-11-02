import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import miloLight from "../../assets/milo-light.png";
import miloDark from "../../assets/milo2.jpg";
import "../../styles/SplashScreen.css";

export default function SplashScreen({ show, onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  let isDarkMode = false;
  try {
    const themeContext = useTheme();
    if (themeContext) isDarkMode = themeContext.isDarkMode;
  } catch {
    isDarkMode = false;
  }

  const imageSrc = isDarkMode ? miloDark : miloLight;

  useEffect(() => {
    if (!show) return;

    const totalTime = 1800; // 18s
    const intervalTime = 50; // cada 50ms
    const step = 100 / (totalTime / intervalTime); // incremento suave

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setProgress(100);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(() => {
              if (onFinish) onFinish();
            }, 1200); // fade-out
          }, 1200); // mantener 100% visible
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [show, onFinish]);

  if (!show) return null;

  return (
    <div className={`splash-container ${isDone ? "fade-out" : ""}`}>
      <div className="splash-content">
        <img src={imageSrc} alt="Milo" className="splash-logo" />
        <h1 className="splash-title">
          Milo<span>Assistant</span>
        </h1>
        <div className="progress-bar">
          <div
            className="progress-fill shimmer"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="splash-text">
          {progress < 100
            ? `Cargando... (${Math.round(progress)}%)`
            : "¡Listo!"}
        </p>
      </div>
    </div>
  );
}
