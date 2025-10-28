import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import FunctionalitiesMenu from "./FunctionalitiesMenu";

import "../styles/ThemeToggle.css";
export default function Navbar({ showProfile, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <span>MiloAssistant</span>
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
