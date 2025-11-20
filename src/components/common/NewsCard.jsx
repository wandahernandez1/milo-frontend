import React from "react";
import "../../styles/NewsCard.css";

export default function NewsCard({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="news-card-container empty">
        <div className="news-empty-state">
          <i className="fas fa-newspaper"></i>
          <p>No se encontraron noticias</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-card-container">
      <div className="news-header">
        <div className="news-icon-wrapper">
          <i className="fas fa-newspaper"></i>
        </div>
        <div className="news-title-section">
          <h3>Noticias destacadas</h3>
          <p className="news-subtitle">Últimas actualizaciones de hoy</p>
        </div>
      </div>

      <div className="news-articles-grid">
        {articles.map((article, index) => (
          <article key={index} className="news-article-card">
            <div className="article-badge">
              <i className="fas fa-circle"></i>
              <span>Ahora</span>
            </div>

            {article.urlToImage && (
              <div className="article-image-wrapper">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="article-image-overlay"></div>
              </div>
            )}

            <div className="article-content">
              <h4 className="article-title">{article.title}</h4>
              {article.description && (
                <p className="article-description">
                  {article.description.length > 100
                    ? `${article.description.substring(0, 100)}...`
                    : article.description}
                </p>
              )}{" "}
              <div className="article-footer">
                {article.source?.name && (
                  <span className="article-source">
                    <i className="fas fa-building"></i>
                    {article.source.name}
                  </span>
                )}

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-read-more"
                >
                  Leer más
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="news-footer">
        <i className="fas fa-info-circle"></i>
        <span>Actualizado hace unos momentos</span>
      </div>
    </div>
  );
}
