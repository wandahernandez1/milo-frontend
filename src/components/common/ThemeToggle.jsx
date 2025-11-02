import React from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/ThemeToggle.css";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className="theme-switch"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDarkMode ? "Modo claro" : "Modo oscuro"}
    >
      <div className={`switch-track ${isDarkMode ? "dark" : "light"}`}>
        <div className="switch-thumb">
          {isDarkMode ? (
            <HiOutlineMoon className="switch-icon" />
          ) : (
            <HiOutlineSun className="switch-icon" />
          )}
        </div>
      </div>
    </button>
  );
}
