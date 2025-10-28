import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import miloAvatar from "../assets/milo-avatar.png";
import "../styles/login.css";

import { useAuth } from "../context/AuthContext";
import { useMessages } from "../hooks/useMessage";
import Message from "../components/Message";
import SplashScreen from "../components/SplashScreen";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { currentUser, loading, login } = useAuth();
  const { message, type, showMessage } = useMessages();
  const navigate = useNavigate();

  // Redirige al dashboard si ya hay usuario
  useEffect(() => {
    if (!loading && currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (!result.success) {
      showMessage(result.message || "Credenciales incorrectas", "error");
    } else {
      showMessage("¡Inicio de sesión exitoso!", "success");
      // Navegación se maneja en useEffect
    }
  };

  // Mientras cargamos usuario o hacemos login, mostramos splash
  if (loading) return <SplashScreen />;

  return (
    <div>
      <Navbar />
      <main className="login-container">
        <div className="login-card">
          {/* Panel izquierdo */}
          <div className="left-panel">
            <h2 className="panel-title">MiloAssistant</h2>
            <img src={miloAvatar} alt="Avatar" className="panel-avatar" />
            <p className="panel-tagline">Tu asistente personal</p>
          </div>

          {/* Panel derecho */}
          <div className="right-panel">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">Correo electrónico</label>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  id="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password">Contraseña</label>
              </div>

              <button type="submit" className="login-button">
                Ingresar
              </button>
            </form>

            <a href="/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
            <p>
              ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
          </div>
        </div>

        {/* Toast de mensajes */}
        <Message message={message} type={type} onClose={() => {}} />
      </main>
    </div>
  );
}
