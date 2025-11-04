import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../styles/functionalities-menu.css";

export default function FunctionalitiesMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const funcionalidades = [
    {
      name: "Calendario",
      fullName: "Gestiona tu calendario",
      path: "/panel/calendario",
    },
    {
      name: "Chat Milo",
      fullName: "Habla con Milo",
      path: "/panel",
    },
    {
      name: "Noticias",
      fullName: "Noticias de hoy",
      path: "/panel/novedades",
    },
    {
      name: "Clima",
      fullName: "Clima en tiempo real",
      path: "#",
    },
    {
      name: "Tareas y Notas",
      fullName: "Gestiona tareas y notas",
      path: "/panel/tareas",
    },
  ];

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
              <Link
                key={idx}
                to={item.path}
                className="dropdown-link"
                onClick={() => setOpen(false)}
              >
                <div className="dropdown-text">
                  <span className="dropdown-name">{item.name}</span>
                  <span className="dropdown-description">{item.fullName}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
