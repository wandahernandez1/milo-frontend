import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/functionalities-menu.css";
export default function FunctionalitiesMenu() {
  const [open, setOpen] = useState(false);

  const funcionalidades = [
    { name: "Gestiona tu calendario" },
    { name: "Habla con Milo" },
    { name: "Noticias de hoy" },
    { name: "Clima en tiempo real" },
    { name: "Gestiona tareas y notas" },
  ];

  return (
    <div className="functionalities-menu-container">
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
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
