import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../context/MessageContext";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const { showMessage } = useMessages();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential; // ✅ El ID token real
      const result = await loginWithGoogle(googleToken);

      if (result.success) {
        showMessage(`¡Bienvenido ${result.user.name || ""}!`, "success");
        navigate("/dashboard", { replace: true });
      } else {
        showMessage(result.message || "Error con Google", "error");
      }
    } catch (err) {
      console.error("Google login error:", err);
      showMessage("Error de conexión con el servidor", "error");
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => showMessage("Falló el inicio con Google", "error")}
      />
    </GoogleOAuthProvider>
  );
}
