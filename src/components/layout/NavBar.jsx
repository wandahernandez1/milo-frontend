import { Link } from "react-router-dom";
import ProfileMenu from "../../features/profile/ProfileMenu";
import FunctionalitiesMenu from "../common/FunctionalitiesMenu";
import ThemeToggle from "../common/ThemeToggle";
import "../../styles/ThemeToggle.css";

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
