import { useState, useEffect } from "react";
import { useAdmin } from "../../context/adminContext";

export default function EditAdminModal({ admin, onClose }) {
  const { updateAdmin, clearErrors } = useAdmin();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (admin) {
      setFormData({
        username: admin.username,
        email: admin.email,
        password: ""
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    setIsSubmitting(true);

    const dataToSend = {
      username: formData.username,
      email: formData.email
    };

    if (showPasswordFields && formData.password.trim() !== "") {
      dataToSend.password = formData.password;
    }

    try {
      await updateAdmin(admin._id, dataToSend);
      onClose();
    } catch (error) {
      console.error("Error updating admin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!admin) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Encabezado */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Editar Administrador</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Actualiza la información del administrador</p>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5 text-gray-600">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="Ingrese el nombre de usuario"
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="ejemplo@dominio.com"
            />
          </div>
          
          <div className="flex items-center space-x-3 pt-2">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="changePassword"
                checked={showPasswordFields}
                onChange={() => setShowPasswordFields(!showPasswordFields)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
            </div>
            <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
              Cambiar contraseña
            </label>
          </div>
          
          {showPasswordFields && (
            <div className="space-y-1 animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Mínimo 6 caracteres"
              />
              <p className="text-xs text-gray-500 mt-1">Dejar en blanco para mantener la contraseña actual</p>
            </div>
          )}
          
          {/* Pie del modal */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}