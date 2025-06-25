import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Button, Input, Label, Message } from "../components/ui";

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { resetPassword, loading, successMessage, errors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmError("");

    // Validaciones
    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmError("Las contraseñas no coinciden");
      return;
    }

    const result = await resetPassword(token, newPassword);
    
    if (result.success) {
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  if (!token) {
    return null; // O mostrar loading
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#165a4c] text-center mb-6">
          Restablecer Contraseña
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          Ingresa tu nueva contraseña
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="block text-gray-700 mb-2">Nueva contraseña</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="********"
              className="bg-[#dde6e2] rounded-lg px-4 py-3 placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
              disabled={loading}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <Label className="block text-gray-700 mb-2">Confirmar contraseña</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="bg-[#dde6e2] rounded-lg px-4 py-3 placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
              disabled={loading}
              required
            />
            {confirmError && (
              <p className="text-red-500 text-sm mt-1">{confirmError}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#165a4c] text-white hover:bg-[#144736] rounded-lg py-3 mt-6"
            disabled={loading}
          >
            {loading ? "Restableciendo..." : "Restablecer Contraseña"}
          </Button>
        </form>

        {/* Mostrar mensajes de éxito */}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
            {successMessage}
            <br />
            <small>Serás redirigido al login en unos segundos...</small>
          </div>
        )}

        {/* Mostrar errores */}
        {errors.length > 0 && (
          <div className="mt-4 space-y-2">
            {errors.map((error, i) => (
              <Message key={i} message={error} />
            ))}
          </div>
        )}

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:underline text-sm"
          >
            Volver al login
          </button>
        </div>
      </Card>
    </div>
  );
}