import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessage";
import Message from "../components/Message";
import "../styles/edit-profile.css";

const initialFormData = {
  name: "",
  fullName: "",
  birthDate: "",
  email: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function EditProfile() {
  const { currentUser, loading, updateUser, deleteUser } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDeleteUsername, setConfirmDeleteUsername] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { message, type, showMessage, hideMessage } = useMessages();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        fullName: currentUser.fullName || "",
        birthDate: currentUser.birthDate || "",
        email: currentUser.email || "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      showMessage(
        "La nueva contraseña y la confirmación no coinciden.",
        "error"
      );
      return;
    }

    const updatedData = {
      name: formData.name,
      fullName: formData.fullName,
      birthDate: formData.birthDate,
    };
    if (formData.newPassword) updatedData.password = formData.newPassword;

    const res = await updateUser(updatedData);
    if (res.success) {
      showMessage("Perfil actualizado correctamente.", "success");
      setFormData({ ...formData, newPassword: "", confirmNewPassword: "" });
    } else {
      showMessage(res.message || "Error al actualizar el perfil.", "error");
    }
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleConfirmDelete = async () => {
    if (confirmDeleteUsername !== formData.name) {
      showMessage("El nombre de usuario no coincide.", "error");
      return;
    }

    const res = await deleteUser();
    if (res.success) {
      showMessage("Cuenta eliminada correctamente.", "success");
      setTimeout(() => navigate("/login"), 1000);
    } else {
      showMessage(res.message || "Error al eliminar la cuenta.", "error");
    }
    closeDeleteModal();
  };

  if (loading) return <div className="loading-container">Cargando...</div>;
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <main className="edit-profile-container">
      {/* Botón de volver */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Volver
      </button>

      <div className="edit-profile-card">
        {/* Avatar centrado */}
        <div className="profile-avatar">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>

        {/* Header */}
        <div className="profile-header">
          <h2>Editar Perfil</h2>
          <p>Actualiza la información de tu cuenta.</p>
        </div>

        {/* Formulario */}
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Nombre de usuario */}
          <div className="input-group">
            <input
              id="profileUsername"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label htmlFor="profileUsername">Nombre de Usuario</label>
            <i className="fas fa-user input-icon"></i>
          </div>

          {/* Nombre completo */}
          <div className="input-group">
            <input
              id="profileFullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder=" "
            />
            <label htmlFor="profileFullName">Nombre Completo</label>
            <i className="fas fa-id-card input-icon"></i>
          </div>

          {/* Fecha de nacimiento */}
          <div className="input-group">
            <input
              id="profileBirthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              placeholder=" "
            />
            <label htmlFor="profileBirthDate">Fecha de Nacimiento</label>
            <i className="fas fa-calendar-alt input-icon"></i>
          </div>

          {/* Email */}
          <div className="input-group">
            <input
              id="profileEmail"
              name="email"
              type="email"
              value={formData.email}
              placeholder=" "
              readOnly
            />
            <label htmlFor="profileEmail">Email</label>
            <i className="fas fa-envelope input-icon"></i>
          </div>

          {/* Nueva contraseña */}
          <div className="input-group password-group">
            <input
              id="profileNewPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder=" "
            />
            <label htmlFor="profileNewPassword">Nueva Contraseña</label>
            <i className="fas fa-lock input-icon"></i>
            <i
              className={`toggle-password fas ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              }`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          {/* Confirmar contraseña */}
          <div className="input-group password-group">
            <input
              id="profileConfirmNewPassword"
              name="confirmNewPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              placeholder=" "
            />
            <label htmlFor="profileConfirmNewPassword">
              Confirmar Nueva Contraseña
            </label>
            <i className="fas fa-lock input-icon"></i>
            <i
              className={`toggle-password fas ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              }`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          {/* Botón guardar cambios */}
          <div className="form-actions">
            <button type="submit" className="btn primary-btn">
              Guardar Cambios
            </button>
          </div>
        </form>

        {/* Sección eliminar cuenta */}
        <div className="delete-account-section">
          <h3>Eliminar Cuenta</h3>
          <p>
            Esta acción es irreversible y eliminará permanentemente todos tus
            datos.
          </p>
          <button
            type="button"
            className="btn danger-btn"
            onClick={openDeleteModal}
          >
            Eliminar mi cuenta
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar eliminación</h3>
            <p>
              Esta acción es irreversible. Escribe tu nombre de usuario para
              confirmar.
            </p>
            <div className="input-group">
              <input
                type="text"
                value={confirmDeleteUsername}
                onChange={(e) => setConfirmDeleteUsername(e.target.value)}
                placeholder="Nombre de usuario"
              />
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={closeDeleteModal}>
                Cancelar
              </button>
              <button className="btn danger-btn" onClick={handleConfirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      <Message message={message} type={type} onClose={hideMessage} />
    </main>
  );
}
