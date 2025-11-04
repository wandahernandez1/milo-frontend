import { useEffect, useRef } from "react";
import Navbar from "../components/layout/NavBar";
import Plasma from "../components/Plasma";
import miloAvatarDark from "../assets/milo2.jpg";
import miloAvatarLight from "../assets/milo-light.png";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const featuresRef = useRef([]);
  const heroRef = useRef(null);

  const handleStartClick = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const currentMiloAvatar = isDarkMode ? miloAvatarDark : miloAvatarLight;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    featuresRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    if (heroRef.current) observer.observe(heroRef.current);

    return () => {
      featuresRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  const features = [
    {
      icon: "fas fa-check-circle",
      title: "Gestión de Tareas",
      description:
        "Organiza y prioriza tus actividades con un sistema intuitivo",
    },
    {
      icon: "fas fa-calendar-check",
      title: "Calendario Integrado",
      description: "Sincronización perfecta con Google Calendar",
    },
    {
      icon: "fas fa-brain",
      title: "IA Conversacional",
      description: "Asistente potenciado por Gemini AI",
    },
    {
      icon: "fas fa-pen-fancy",
      title: "Notas Rápidas",
      description: "Captura y organiza tus ideas al instante",
    },
  ];

  return (
    <div className="home-container">
      <Plasma
        color="#9b59b6"
        speed={0.2}
        direction="forward"
        scale={1.8}
        opacity={0.3}
        mouseInteractive={true}
      />

      <div style={{ position: "relative", zIndex: 100 }}>
        <Navbar showProfile={false} />
      </div>

      <section className="hero-section-minimal" ref={heroRef}>
        <div className="hero-content-minimal">
          <img
            src={currentMiloAvatar}
            alt="MiloAssistant"
            className="hero-avatar-minimal"
          />
          <h1 className="hero-title-minimal">
            Tu asistente personal <br />
            <span className="highlight-minimal">inteligente</span>
          </h1>
          <p className="hero-text-minimal">
            Organiza tu vida de manera simple y eficiente
          </p>
          <button
            className="cta-button-minimal primary"
            onClick={handleStartClick}
          >
            Comenzar ahora
          </button>
        </div>
      </section>

      <section className="features-section-minimal">
        <div className="features-container-minimal">
          <h2 className="section-title-minimal">
            Todo lo que necesitas en un solo lugar
          </h2>
          <div className="features-grid-minimal">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card-minimal"
                ref={(el) => (featuresRef.current[index] = el)}
              >
                <div className="feature-icon-minimal">
                  <i className={feature.icon}></i>
                </div>
                <h3 className="feature-title-minimal">{feature.title}</h3>
                <p className="feature-description-minimal">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section-minimal">
        <div className="cta-content-minimal">
          <div className="cta-badge">100% Gratuito</div>
          <h2 className="cta-title-minimal">Comienza tu transformación</h2>
          <p className="cta-subtitle-minimal">
            Miles de usuarios ya están optimizando su productividad. ¿Te unes?
          </p>
          <div className="cta-features-list">
            <div className="cta-feature-item">
              <span className="cta-check">✓</span>
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="cta-feature-item">
              <span className="cta-check">✓</span>
              <span>Listo en minutos</span>
            </div>
          </div>
          <button
            className="cta-button-minimal secondary"
            onClick={handleStartClick}
          >
            Crear cuenta gratis
          </button>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <p className="footer-text">
            © 2025 MiloAssistant. Tu privacidad es nuestra prioridad.
          </p>
        </div>
      </footer>
    </div>
  );
}
