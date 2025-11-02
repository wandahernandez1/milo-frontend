// src/components/ThemeToggle.jsx
import React, { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/ThemeToggle.css";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setAnimating(true);
    toggleTheme();
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      className="theme-toggle-btn"
      onClick={handleClick}
      title="Cambiar tema"
    >
      {isDarkMode ? (
        <FaSun
          className={`theme-icon ${animating ? "animating" : ""}`}
          aria-label="Modo claro"
        />
      ) : (
        <FaMoon
          className={`theme-icon ${animating ? "animating" : ""}`}
          aria-label="Modo oscuro"
        />
      )}
    </button>
  );
}
