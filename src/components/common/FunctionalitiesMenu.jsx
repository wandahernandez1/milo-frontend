import { useState, useEffect, useRef } from "react";
import "../../styles/functionalities-menu.css";

export default function FunctionalitiesMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const funcionalidades = [
    {
      name: "Calendario",
      fullName: "Gestiona tu calendario",
    },
    {
      name: "Chat Milo",
      fullName: "Habla con Milo",
    },
    {
      name: "Noticias",
      fullName: "Noticias de hoy",
    },
    {
      name: "Clima",
      fullName: "Clima en tiempo real",
    },
    {
      name: "Tareas y Notas",
      fullName: "Gestiona tareas y notas",
    },
  ];

  const handleItemClick = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {open && (
        <div className="dropdown-overlay" onClick={() => setOpen(false)} />
      )}

      <div className="functionalities-menu-container" ref={menuRef}>
        <div className="functionalities-button" onClick={() => setOpen(!open)}>
          <span className="functionalities-title">Funcionalidades</span>
          <i
            className={`fas fa-caret-down dropdown-arrow ${open ? "open" : ""}`}
          ></i>
        </div>

        {open && (
          <div className="dropdown-content">
            {funcionalidades.map((item, idx) => (
              <div
                key={idx}
                className="dropdown-link"
                onClick={handleItemClick}
              >
                <div className="dropdown-text">
                  <span className="dropdown-name">{item.name}</span>
                  <span className="dropdown-description">{item.fullName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
