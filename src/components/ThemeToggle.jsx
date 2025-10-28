import React, { useState, memo } from "react";
import { useTheme } from "../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon as faRegMoon,
  faSun as faRegSun,
} from "@fortawesome/free-regular-svg-icons";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setAnimating(true);
    toggleTheme();
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      className="theme-toggle-btn"
      onClick={handleClick}
      title="Cambiar tema"
    >
      <FontAwesomeIcon
        icon={isDarkMode ? faRegMoon : faRegSun}
        className={`theme-icon ${animating ? "animating" : ""}`}
      />
    </button>
  );
};

export default memo(ThemeToggle);
