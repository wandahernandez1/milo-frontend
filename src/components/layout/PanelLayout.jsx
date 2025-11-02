import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faNoteSticky,
  faCalendarAlt,
  faTasks,
  faBell,
  faCog,
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "../../styles/PanelLayout.css";

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
        {count !== undefined && (
          <span className="card-count-badge">{count}</span>
        )}
        <FontAwesomeIcon icon={faChevronRight} className="card-chevron" />
      </div>
    </div>
  </Link>
);

const PerfilContent = ({ currentUser, logout }) => {
  const userName = currentUser?.nombre || currentUser?.displayName || "Usuario";
  const firstInitial = userName.charAt(0).toUpperCase();
  const userEmail = currentUser?.email || "Email no disponible";

  const applicationSections = [
    { label: "Mis Notas", icon: faNoteSticky, path: "/panel/notas", count: 12 },
    {
      label: "Mis Tareas",
      icon: faTasks,
      path: "/panel/tareas",
      count: 5,
    },
    {
      label: "Recordatorios",
      icon: faBell,
      path: "/panel/recordatorios",
      count: 3,
    },
    {
      label: "Eventos",
      icon: faCalendarAlt,
      path: "/panel/eventos",
      count: 1,
    },
  ];

  const settingsSections = [
    {
      label: "Configuración",
      icon: faCog,
      path: "/panel/configuracion",
    },
  ];

  return (
    <section className="profile-section">
      <header className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar-placeholder">
            {firstInitial && firstInitial !== "U" ? (
              <span className="avatar-initial">{firstInitial}</span>
            ) : (
              <FontAwesomeIcon icon={faUser} className="avatar-icon" />
            )}
          </div>
        </div>
        <h1>{userName}</h1>
        <p className="user-email">{userEmail}</p>
      </header>

      <div className="profile-cards-grid">
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
          <button className="logout-button" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </section>
  );
};

export default function PanelLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return window.innerWidth <= 768 ? false : false;
  });

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

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
      id: "config",
      label: "Ajustes",
      icon: faCog,
      path: "/panel/configuracion",
    },
  ];

  const activePath = location.pathname;
  const isNavItemActive = (path) =>
    path === "/panel" ? activePath === "/panel" : activePath.startsWith(path);

  return (
    <>
      <Navbar showProfile={true} />
      <div className="panel-container">
        <aside
          className={`panel-sidebar-card ${
            isCollapsed ? "sidebar-collapsed" : ""
          }`}
        >
          <div className="sidebar-header">
            <div className="header-top-row">
              {!isCollapsed && <h3 className="sidebar-title">Panel</h3>}
              <button
                className={`collapse-toggle-button ${
                  isCollapsed ? "collapsed" : ""
                }`}
                onClick={toggleSidebar}
                title={isCollapsed ? "Expandir" : "Contraer"}
              >
                <FontAwesomeIcon
                  icon={isCollapsed ? faChevronRight : faChevronLeft}
                  className="collapse-icon"
                />
              </button>
            </div>
          </div>

          <nav className="sidebar-nav-list-wrapper">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`sidebar-nav-item ${
                  isNavItemActive(item.path) ? "active" : ""
                }`}
                data-tooltip={item.label}
              >
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={item.icon} className="icon" />
                </div>
                {!isCollapsed && (
                  <span className="item-label">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="panel-content-area">
          {activePath !== "/panel" && (
            <div className="panel-breadcrumb">
              <button
                className="breadcrumb-link"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">
                {navItems.find(
                  (item) =>
                    activePath.startsWith(item.path) && item.path !== "/panel"
                )?.label || ""}
              </span>
            </div>
          )}

          {activePath === "/panel" ? (
            <PerfilContent currentUser={currentUser} logout={logout} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </>
  );
}
