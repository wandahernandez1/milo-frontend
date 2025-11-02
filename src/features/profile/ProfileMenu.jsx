// src/components/ProfileMenu.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileMenu() {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) {
    return null;
  }

  const firstInitial = currentUser.name.charAt(0).toUpperCase();
  // Obtener el color guardado o usar un valor por defecto
  const avatarColor = currentUser.avatarColor || "#6c757d";

  const handleLogout = async () => {
    setOpen(false); // Cierra el menú
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="profile-menu-container">
      <div className="profile-button" onClick={() => setOpen(!open)}>
        {/* Avatar con lógica de foto/color */}
        <div
          className="avatar"
          style={{
            backgroundColor: currentUser.photoURL ? "transparent" : avatarColor,
          }}
        >
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Avatar"
              className="profile-image-small"
            />
          ) : (
            firstInitial
          )}
        </div>

        <span className="profile-name">{currentUser.name}</span>
        <i
          className={`fas fa-caret-down dropdown-arrow ${open ? "open" : ""}`}
        ></i>
      </div>

      {open && (
        <div className="dropdown-content">
          <Link
            to="/panel"
            className="dropdown-link"
            onClick={() => setOpen(false)}
          >
            Panel Personal
          </Link>
          <Link
            to="/edit-profile"
            className="dropdown-link"
            onClick={() => setOpen(false)}
          >
            Editar Perfil
          </Link>

          <button
            onClick={handleLogout}
            className="dropdown-link logout-button"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
