import Navbar from "../components/layout/NavBar";
import Plasma from "../components/Plasma";
import "../styles/comoUsarMilo.css";

export default function ComoUsarMilo() {
  const features = [
    {
      icon: "fas fa-comments",
      title: "Conversa de Forma Natural",
      description:
        "Interactúa con Milo a través de texto, de manera natural y empática.",
      steps: [
        "Hazle preguntas sobre cualquier tema",
        "Dale comandos para gestionar tareas",
      ],
    },
    {
      icon: "fas fa-calendar-check",
      title: "Organiza tus Días",
      description:
        "Centraliza tus tareas con recordatorios, notas y una agenda integrada.",
      steps: [
        "Crea tareas y establece recordatorios",
        "Toma notas rápidas desde el chat",
        "Consulta tu calendario integrado",
      ],
    },
    {
      icon: "fas fa-cloud-sun",
      title: "Información en Tiempo Real",
      description:
        "Accede al clima, noticias y eventos sin cambiar de aplicación.",
      steps: [
        "Consulta el clima de tu ubicación",
        "Lee las últimas noticias",
        "Revisa eventos importantes del día",
      ],
    },
    {
      icon: "fas fa-lightbulb",
      title: "Sugerencias Inteligentes",
      description:
        "Recibe recomendaciones proactivas para mejorar tu productividad.",
      steps: [
        "Milo aprende de tus hábitos",
        "Sugiere acciones según el contexto",
        "Optimiza tu rutina diaria",
      ],
    },
  ];

  return (
    <div className="page-wrapper">
      <Plasma
        color="#9b59b6"
        speed={0.2}
        direction="forward"
        scale={1.8}
        opacity={0.12}
        mouseInteractive={false}
      />
      <Navbar />
      <main className="how-to-use-container">
        <a href="/" className="back-button">
          <i className="fas fa-arrow-left"></i>
          <span>Volver</span>
        </a>

        <section className="hero-section">
          <div className="badge">Guía de Uso</div>
          <h1>
            Cómo usar <span className="highlight">Milo</span>
          </h1>
          <p className="subtitle">
            Tu asistente personal inteligente, diseñado para simplificar tu día
            a día
          </p>
        </section>

        <section className="features-section">
          {features.map((feature, index) => (
            <article key={index} className="feature-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
              </div>
              <p className="description">{feature.description}</p>
              <ul className="steps-list">
                {feature.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>
                    <i className="fas fa-check-circle"></i>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="cta-section">
          <h2>¿Listo para comenzar?</h2>
          <p>Empieza a usar Milo y transforma tu productividad</p>
          <a href="/dashboard" className="cta-button">
            Ir al Dashboard
            <i className="fas fa-arrow-right"></i>
          </a>
        </section>
      </main>
    </div>
  );
}
