import React from "react";
import { useNavigate } from "react-router-dom";

export default function ActionCards({ handleCardClick }) {
  const navigate = useNavigate();

  const cards = [
    {
      key: "clima",
      icon: "fas fa-cloud",
      title: "Clima",
      desc: "Consulta el clima actual",
    },
    {
      key: "calendario",
      icon: "fas fa-calendar-alt",
      title: "Calendario",
      desc: "Accede a tu calendario",
    },
    {
      key: "tareas",
      icon: "fas fa-tasks",
      title: "Tareas",
      desc: "Organiza tus tareas",
    },
    {
      key: "noticias",
      icon: "fas fa-list-ul",
      title: "Novedades Locales",
      desc: "Ve noticias de hoy",
    },
    {
      key: "nota",
      icon: "fas fa-sticky-note",
      title: "Notas",
      desc: "Anota tus pendientes",
    },
  ];

  return (
    <section className="action-cards-section">
      {cards.map((c) => (
        <div
          key={c.key}
          className="card"
          onClick={() => (c.action ? c.action() : handleCardClick(c.key))}
        >
          <i className={`${c.icon} icon`}></i>
          <p className="card-title">{c.title}</p>
          <p className="card-description">{c.desc}</p>
        </div>
      ))}
    </section>
  );
}
