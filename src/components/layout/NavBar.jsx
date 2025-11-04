import { Link, useLocation } from "react-router-dom";
import ProfileMenu from "../../features/profile/ProfileMenu";
import FunctionalitiesMenu from "../common/FunctionalitiesMenu";
import ThemeToggle from "../common/ThemeToggle";
import "../../styles/ThemeToggle.css";

export default function Navbar({ showProfile, onLogout }) {
  const location = useLocation();

  const getLogoPath = () => {
    if (location.pathname === "/dashboard") {
      return "/";
    }
    if (location.pathname.startsWith("/panel")) {
      return "/dashboard";
    }
    return showProfile ? "/dashboard" : "/";
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to={getLogoPath()} className="logo-link">
          MiloAssistant
        </Link>
      </div>

      <nav className="navbar-right">
        <ul className="nav-links">
          <li>
            <FunctionalitiesMenu />
          </li>
          <li>
            <Link to="/como-usar-milo">Como usar Milo</Link>
          </li>
          <li>
            <Link to="/novedades">Novedades</Link>
          </li>
          <li>
            <ThemeToggle />
          </li>

          {showProfile && (
            <li className="profile-menu-wrapper">
              <ProfileMenu onLogout={onLogout} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
