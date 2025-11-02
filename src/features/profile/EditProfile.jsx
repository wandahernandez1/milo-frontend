import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../hooks/useMessage";
import Message from "../../components/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowLeft,
  faUser,
  faIdCard,
  faCalendarAlt,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faImage,
  faExclamationTriangle,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/edit-profile.css";

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
  const { message, type, showMessage, hideMessage } = useMessages();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  const [avatarColor, setAvatarColor] = useState("#6c757d");
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState(null);

  const [confirmDeleteUsername, setConfirmDeleteUsername] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const formattedBirthDate = currentUser.birthDate
        ? currentUser.birthDate.split("T")[0]
        : "";

      setFormData({
        name: currentUser.name || "",
        fullName: currentUser.fullName || "",
        birthDate: formattedBirthDate,
        email: currentUser.email || "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setAvatarColor(currentUser.avatarColor || "#6c757d");
      // 🔑 Prioridad de avatar: avatar personalizado > googleAvatar > null
      setNewPhotoPreview(currentUser.avatar || null);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleColorChange = (e) => {
    setAvatarColor(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage("La imagen no puede superar los 5MB.", "error");
        return;
      }
      setNewPhotoFile(file);
      setNewPhotoPreview(URL.createObjectURL(file));
      showMessage(`Imagen seleccionada: ${file.name}`, "info");
    }
  };

  const handleRemovePhoto = () => {
    setNewPhotoFile(null);
    setNewPhotoPreview(null);
    showMessage("Imagen eliminada.", "info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      showMessage("Las contraseñas no coinciden.", "error");
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      showMessage("La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    let photoUrlToUpdate = newPhotoPreview;

    if (newPhotoFile) {
      showMessage("Subiendo imagen... Por favor, espera.", "info");
    }

    const updatedData = {
      name: formData.name,
      fullName: formData.fullName,
      birthDate: formData.birthDate,
      avatarColor: avatarColor,
    };

    if (formData.newPassword) {
      updatedData.password = formData.newPassword;
    }

    const res = await updateUser(updatedData);

    if (res.success) {
      showMessage("Perfil actualizado correctamente.", "success");
      setFormData({ ...formData, newPassword: "", confirmNewPassword: "" });
    } else {
      showMessage(res.message || "Error al actualizar el perfil.", "error");
    }
  };

  const openDeleteModal = () => setShowDeleteModal(true);

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setConfirmDeleteUsername("");
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteUsername !== formData.name) {
      showMessage("El nombre de usuario no coincide.", "error");
      return;
    }

    const res = await deleteUser();

    if (res.success) {
      showMessage("Cuenta eliminada correctamente.", "success");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      showMessage(res.message || "Error al eliminar la cuenta.", "error");
    }

    closeDeleteModal();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const firstInitial = formData.name.charAt(0).toUpperCase() || "U";

  return (
    <main className="edit-profile-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Volver
      </button>

      <div className="edit-profile-card">
        <div className="profile-header">
          <h2>Editar Perfil</h2>
          <p>Personaliza tu cuenta y mantén tu información actualizada</p>
        </div>

        <div
          className="profile-avatar"
          style={{
            backgroundColor: newPhotoPreview ? "transparent" : avatarColor,
          }}
        >
          {newPhotoPreview ? (
            <img
              src={newPhotoPreview}
              alt={`Avatar de ${formData.name}`}
              className="profile-image"
            />
          ) : (
            firstInitial
          )}
        </div>

        <div className="avatar-customization-controls">
          <div className="color-selector-group">
            <label htmlFor="avatarColor" className="color-label">
              Color:
            </label>
            <input
              id="avatarColor"
              type="color"
              value={avatarColor}
              onChange={handleColorChange}
              className="color-input"
              disabled={!!newPhotoPreview}
              title="Selecciona un color para tu avatar"
            />
          </div>

          <div className="file-upload-actions">
            <label htmlFor="photoUpload" className="btn secondary-btn small">
              <FontAwesomeIcon icon={faImage} />
              {newPhotoPreview ? "Cambiar foto" : "Subir foto"}
            </label>
            <input
              id="photoUpload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />

            {(newPhotoPreview || newPhotoFile) && (
              <button
                type="button"
                className="btn tertiary-btn small"
                onClick={handleRemovePhoto}
                title="Eliminar foto"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
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
            <FontAwesomeIcon icon={faUser} className="input-icon" />
          </div>

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
            <FontAwesomeIcon icon={faIdCard} className="input-icon" />
          </div>

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
            <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
          </div>

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
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          </div>

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
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

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
              Confirmar Contraseña
            </label>
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary-btn">
              <FontAwesomeIcon icon={faSave} /> Guardar Cambios
            </button>
          </div>
        </form>

        <div className="delete-account-section">
          <h3>Zona de Peligro</h3>
          <p>
            La eliminación de tu cuenta es permanente e irreversible. Todos tus
            datos serán eliminados.
          </p>
          <button
            type="button"
            className="btn danger-btn"
            onClick={openDeleteModal}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} /> Eliminar Cuenta
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Confirmar Eliminación</h3>
            <p>
              Esta acción es <strong>irreversible</strong>. Por favor, escribe
              tu nombre de usuario <strong>"{formData.name}"</strong> para
              confirmar.
            </p>
            <div className="input-group">
              <input
                type="text"
                value={confirmDeleteUsername}
                onChange={(e) => setConfirmDeleteUsername(e.target.value)}
                placeholder="Escribe tu nombre de usuario"
              />
            </div>
            <div className="modal-actions">
              <button className="btn cancel-btn" onClick={closeDeleteModal}>
                Cancelar
              </button>
              <button
                className="btn danger-btn"
                onClick={handleConfirmDelete}
                disabled={confirmDeleteUsername !== formData.name}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <Message message={message} type={type} onClose={hideMessage} />
    </main>
  );
}
