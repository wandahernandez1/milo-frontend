import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProfileMenu() {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) {
    return null;
  }

  // Prioridad: nombre completo > displayName > name
  const displayName =
    currentUser.fullName ||
    currentUser.displayName ||
    currentUser.name ||
    "Usuario";
  const firstInitial = displayName.charAt(0).toUpperCase();

  // Prioridad de avatar: avatar personalizado > googleAvatar > null
  const userAvatar = currentUser.avatar || currentUser.googleAvatar || null;
  const avatarColor = currentUser.avatarColor || "#6c757d";

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="profile-menu-container">
      <div className="profile-button" onClick={() => setOpen(!open)}>
        <div
          className="avatar"
          style={{
            backgroundColor: userAvatar ? "transparent" : avatarColor,
          }}
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="Avatar"
              className="profile-image-small"
              onError={(e) => {
                // Fallback si la imagen falla
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = firstInitial;
                e.target.parentElement.style.backgroundColor = avatarColor;
              }}
            />
          ) : (
            firstInitial
          )}
        </div>

        <span className="profile-name">{displayName}</span>
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
