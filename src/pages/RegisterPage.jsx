import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/NavBar";
import miloAvatar from "../assets/milo-avatar.png";
import "../styles/login.css";
import "../styles/register.css";

import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessage";
import Message from "../components/Message";

export default function Register() {
  const { register } = useAuth();
  const { message, type, showMessage } = useMessages();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showMessage("Las contraseñas no coinciden", "error");
      return;
    }

    setIsLoading(true);
    const result = await register(name, email, password);
    setIsLoading(false);

    if (result.success) {
      showMessage("Registro exitoso. ¡Bienvenido!", "success");
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      showMessage(result.message || "Error en el registro", "error");
    }
  };

  return (
    <div>
      <Navbar />

      <main className="login-container">
        <div className="register-card">
          {/* Panel izquierdo */}
          <div className="left-panel">
            <h2 className="panel-title">¡Únete a MiloAssistant!</h2>
            <img src={miloAvatar} alt="Avatar" className="panel-avatar" />
            <p className="panel-tagline">Crea tu cuenta</p>
          </div>

          {/* Panel derecho */}
          <div className="right-panel">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group floating-label-group">
                <input
                  type="text"
                  id="name"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="name">Nombre</label>
              </div>

              <div className="input-group floating-label-group">
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

              <div className="input-group floating-label-group">
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

              <div className="input-group floating-label-group">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Registrarse"}
              </button>
            </form>

            <p>
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>

        <Message message={message} type={type} onClose={() => {}} />
      </main>
    </div>
  );
}
