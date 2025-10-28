import Navbar from "../components/Navbar";
import Threads from "../components/Threads";
import miloAvatarDark from "../assets/milo2.jpg";
import miloAvatarLight from "../assets/milo-light.png";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();

  const { isDarkMode } = useTheme();

  const handleStartClick = () => {
    navigate("/login");
  };

  const currentMiloAvatar = isDarkMode ? miloAvatarDark : miloAvatarLight;
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Fondo animado */}
      <Threads
        amplitude={1}
        distance={0}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
        enableMouseInteraction={true}
      />

      {/* Navbar */}
      <Navbar showProfile={false} />

      {/* Contenido principal */}
      <main className="hero-section">
        <img
          src={currentMiloAvatar} // 🚨 ¡Aquí está el cambio clave!
          alt="MiloAssistant Avatar"
          className="hero-avatar"
        />
        <h1 className="hero-title">
          ¡Bienvenido! a <span className="highlight">MiloAssistant</span>
        </h1>
        <p className="hero-text">
          Soy tu asistente personal. Estoy aquí para ayudarte a organizar tu
          día, recordarte tus tareas, mostrarte el clima y mucho más, de forma
          simple y natural.
        </p>
        <button className="cta-button" onClick={handleStartClick}>
          COMENZAR
        </button>
      </main>
    </div>
  );
}
