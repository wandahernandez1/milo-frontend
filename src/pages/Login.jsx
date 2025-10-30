import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import miloAvatar from "../assets/milo-avatar.png";
import "../styles/login.css";

import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import SplashScreen from "../components/SplashScreen";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login } = useAuth();
  const { showMessage } = useMessages();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await login(email, password);

      if (!result.success) {
        showMessage(result.message, "error");
        setIsLoggingIn(false);
      } else {
        showMessage("¡Inicio de sesión exitoso!", "success");
        // Redirigimos al Dashboard sin splash
        navigate("/dashboard", { replace: true, state: { fromLogin: true } });
      }
    } catch (err) {
      showMessage("Error de conexión con el servidor.", "error");
      setIsLoggingIn(false);
    }
  };

  // Mostramos splash mientras hace login
  if (isLoggingIn) return <SplashScreen show={true} />;

  return (
    <div>
      <Navbar />
      <main className="login-container">
        <div className="login-card">
          <div className="left-panel">
            <h2 className="panel-title">MiloAssistant</h2>
            <img src={miloAvatar} alt="Avatar" className="panel-avatar" />
            <p className="panel-tagline">Tu asistente personal</p>
          </div>

          <div className="right-panel">
            <h2>Iniciar Sesión</h2>

            <div className="input-group">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Correo electrónico</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Contraseña</label>
            </div>

            <button
              type="button"
              className="login-button"
              onClick={handleLogin}
            >
              Ingresar
            </button>

            <a href="/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
            <p>
              ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
