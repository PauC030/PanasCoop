import { useState } from "react";
import { useAdmin } from "../../context/adminContext";

export default function CreateAdminForm() {
  const { createAdmin, clearErrors } = useAdmin();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await createAdmin({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      
  setSuccessMessage("✅ Administrador creado correctamente");

        // Ocultar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);

   
      // Reset form on success
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

    return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Crear Nuevo Administrador</h2>
        <p className="text-gray-600">Complete el formulario para registrar un nuevo administrador</p>
      </div>
      
   {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-4 text-green-600 font-semibold bg-green-100 p-3 rounded-lg border border-green-400">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de Usuario <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder="Ingrese el nombre de usuario"
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder="correo@gmail.com"
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder="Confirme su contraseña"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md font-medium"
          >
            Crear Administrador
          </button>
        </div>
      </form>
    </div>
  );
}