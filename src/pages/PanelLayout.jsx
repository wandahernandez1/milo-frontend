import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faNoteSticky,
  faCalendarAlt,
  faTasks,
  faBell,
  faCog,
  faArrowLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/PanelLayout.css";

const ProfileCard = ({ icon, label, path, count }) => (
  <Link to={path} className="profile-card-link">
    <div className="profile-card">
      <div className="card-icon-wrapper">
        <FontAwesomeIcon icon={icon} className="card-icon" />
      </div>
      <div className="card-info">
        <span className="card-label">{label}</span>
      </div>
      <div className="card-details">
        {count !== undefined && <span className="card-count">{count}</span>}
        <FontAwesomeIcon icon={faChevronRight} className="card-chevron" />
      </div>
    </div>
  </Link>
);

export default function PanelLayout() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "perfil", label: "Perfil", icon: faUser, path: "/panel" },
    { id: "notas", label: "Notas", icon: faNoteSticky, path: "/panel/notas" },
    {
      id: "calendario",
      label: "Calendario",
      icon: faCalendarAlt,
      path: "/panel/calendario",
    },
    { id: "tareas", label: "Tareas", icon: faTasks, path: "/panel/tareas" },
    {
      id: "recordatorios",
      label: "Recordatorios",
      icon: faBell,
      path: "/panel/recordatorios",
    },
    {
      id: "config",
      label: "Configuración",
      icon: faCog,
      path: "/panel/configuracion",
    },
  ];

  const activePath = location.pathname;

  const PerfilContent = () => {
    const userName =
      currentUser?.nombre || currentUser?.displayName || "Usuario";

    const applicationSections = [
      {
        label: "Mis Notas",
        icon: faNoteSticky,
        path: "/panel/notas",
        count: 12,
      },
      {
        label: "Mis Tareas Pendientes",
        icon: faTasks,
        path: "/panel/tareas",
        count: 5,
      },
      {
        label: "Recordatorios Activos",
        icon: faBell,
        path: "/panel/recordatorios",
        count: 3,
      },
      {
        label: "Eventos Próximos",
        icon: faCalendarAlt,
        path: "/panel/calendario",
        count: 1,
      },
    ];

    const settingsSections = [
      {
        label: "Configuración de Cuenta",
        icon: faUser,
        path: "/panel/configuracion",
      },
      {
        label: "Privacidad y Seguridad",
        icon: faCog,
        path: "/panel/configuracion",
      },
    ];

    return (
      <section className="profile-section">
        <header className="profile-header">
          <div className="profile-avatar-placeholder">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <h1>{userName}</h1>
          <p className="user-email">
            {currentUser?.email || "Email no disponible"}
          </p>
        </header>

        <div className="card-group">
          <h2 className="card-group-title">Actividad</h2>
          {applicationSections.map((section) => (
            <ProfileCard key={section.label} {...section} />
          ))}
        </div>

        <div className="card-group">
          <h2 className="card-group-title">Ajustes</h2>
          {settingsSections.map((section) => (
            <ProfileCard key={section.label} {...section} />
          ))}
        </div>

        <button className="logout-button">Cerrar Sesión</button>
      </section>
    );
  };

  return (
    <>
      <Navbar showProfile={true} />
      <div className="panel-container">
        <aside className="panel-sidebar-card">
          <div className="sidebar-header">
            <button
              className="back-button-sidebar-card"
              onClick={() => navigate("/dashboard")}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
            <h3 className="sidebar-title">Milo Panel</h3>
          </div>
          <nav className="sidebar-nav-list-wrapper">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`sidebar-button-card ${
                  activePath.startsWith(item.path) &&
                  (item.path !== "/panel" || activePath === "/panel")
                    ? "active"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="icon" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="panel-content-area">
          {activePath === "/panel" ? <PerfilContent /> : <Outlet />}
        </main>
      </div>
    </>
  );
}
