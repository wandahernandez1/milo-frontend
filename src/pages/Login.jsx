import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/NavBar";
import miloAvatar from "../assets/milo2.jpg";
import "../styles/login.css";

import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import SplashScreen from "../components/layout/SplashScreen";

import GoogleLoginButton from "../components/common/GoogleLoginButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
            <p className="panel-tagline">Tu asistente personal inteligente</p>
          </div>

          <div className="right-panel">
            <h2>Bienvenido</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
              Inicia sesión para continuar
            </p>

            <div className="input-group floating-label-group">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Correo electrónico</label>
            </div>

            <div className="input-group floating-label-group password-input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                required
              />
              <label>Contraseña</label>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>

            <button
              type="button"
              className="login-button"
              onClick={handleLogin}
              disabled={!email || !password}
            >
              Ingresar
            </button>

            <div className="google-login-container">
              <GoogleLoginButton />
            </div>

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
