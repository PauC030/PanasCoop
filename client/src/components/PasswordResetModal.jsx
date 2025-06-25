import { useState } from "react";
import { useAuth } from "../context/authContext";
import { Button, Input, Label } from "./ui";

export function PasswordResetModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { sendPasswordReset, loading, successMessage, errors } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");

    if (!email.trim()) {
      setEmailError("El correo electrónico es requerido");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Por favor ingresa un correo electrónico válido");
      return;
    }

    const result = await sendPasswordReset(email);
    
    if (result.success) {
      // Cerrar modal después de 2 segundos si fue exitoso
      setTimeout(() => {
        onClose();
        setEmail("");
        setEmailError("");
      }, 2000);
    }
  };

  const handleClose = () => {
    setEmail("");
    setEmailError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#165a4c]">Recuperar Contraseña</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-gray-700 mb-2">Correo electrónico</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="bg-[#dde6e2] rounded-lg px-4 py-3 placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
                disabled={loading}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg py-3"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#165a4c] text-white hover:bg-[#144736] rounded-lg py-3"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>

          {/* Mostrar mensajes de éxito */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {/* Mostrar errores */}
          {errors.length > 0 && (
            <div className="mt-4 space-y-2">
              {errors.map((error, i) => (
                <div key={i} className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}