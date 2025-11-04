import Navbar from "../components/layout/NavBar";
import Plasma from "../components/Plasma";
import "../styles/novedades.css";

export default function Novedades() {
  const updates = [
    {
      date: "Octubre 2024",
      version: "v2.0",
      items: [
        {
          icon: "fas fa-magic",
          title: "IA Conversacional Mejorada",
          description:
            "Integración de Gemini API para respuestas más naturales y contextuales.",
          tag: "Nuevo",
        },
        {
          icon: "fas fa-cloud-sun",
          title: "Clima en Tiempo Real",
          description:
            "Consulta el clima actual según tu ubicación con OpenWeatherMap API.",
          tag: "Nuevo",
        },
      ],
    },
    {
      date: "Septiembre 2024",
      version: "v1.8",
      items: [
        {
          icon: "fas fa-newspaper",
          title: "Noticias Relevantes",
          description:
            "Accede a noticias actualizadas con filtros por país y categoría mediante NewsAPI.",
          tag: "Nuevo",
        },
        {
          icon: "fas fa-tasks",
          title: "Gestión de Tareas Optimizada",
          description:
            "Interfaz renovada para organizar tus tareas y recordatorios de forma más intuitiva.",
          tag: "Mejorado",
        },
      ],
    },
    {
      date: "Próximamente",
      version: "En desarrollo",
      items: [
        {
          icon: "fas fa-mobile-alt",
          title: "Progressive Web App",
          description:
            "Versión móvil optimizada con soporte offline para usar Milo en cualquier lugar.",
          tag: "Próximamente",
        },
        {
          icon: "fas fa-user-circle",
          title: "Perfiles Personalizados",
          description:
            "Personalización avanzada basada en tus hábitos y preferencias de uso.",
          tag: "Próximamente",
        },
      ],
    },
  ];

  return (
    <div className="page-wrapper">
      <Plasma
        color="#9b59b6"
        speed={0.25}
        direction="forward"
        scale={1.6}
        opacity={0.15}
        mouseInteractive={false}
      />
      <Navbar />
      <main className="novedades-container">
        <a href="/" className="back-button">
          <i className="fas fa-arrow-left"></i>
          <span>Volver</span>
        </a>

        <section className="hero-section">
          <div className="badge">Actualizaciones</div>
          <h1>
            Novedades de <span className="highlight">Milo</span>
          </h1>
          <p className="subtitle">
            Descubre las últimas mejoras y funcionalidades
          </p>
        </section>

        <section className="timeline-section">
          {updates.map((update, index) => (
            <div key={index} className="timeline-block">
              <div className="timeline-header">
                <span className="timeline-date">{update.date}</span>
                <span className="timeline-version">{update.version}</span>
              </div>
              <div className="updates-grid">
                {update.items.map((item, itemIndex) => (
                  <article key={itemIndex} className="update-card">
                    <div className="card-tag">{item.tag}</div>
                    <div className="card-header">
                      <div className="icon-wrapper">
                        <i className={item.icon}></i>
                      </div>
                      <h3>{item.title}</h3>
                    </div>
                    <p className="description">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
