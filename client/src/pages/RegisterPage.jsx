import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import registerImage from '../assets/image login2.jpg';

function Register() {
  const { signup, errors: registerErrors, isAuthenticated, successMessage } = useAuth(); // Agregamos successMessage
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();
  
  const onSubmit = async (value) => {
    await signup(value);
  };
  
  useEffect(() => {
    if (isAuthenticated) navigate("/tasks");
  }, [isAuthenticated]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4 mt-16">
      <div className="flex rounded-xl overflow-hidden shadow-2xl w-full max-w-6xl h-[70vh] min-h-[550px] -mt-14">
        
        
        <div className="w-1/1 bg-[#165a4c] relative">
          <img 
            src={registerImage} 
            alt="Imagen decorativa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-8">
            <h2 className="text-white text-3xl font-bold text-center">
              Únete a PanascOOP y vive la experiencia completa
            </h2>
          </div>
        </div>

        {/* Formulario  */}
        <Card className="p-6 w-1/2 rounded-none shadow-none flex flex-col justify-between">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-[#165a4c] text-center mb-6">Registrarse</h1>
            
            {/*  mensaje de éxito */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{successMessage}</span>
                </div>
              </div>
            )}
            
            {/*  Mensaje informativo detallado cuando el registro es exitoso */}
            {successMessage && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium mb-1">📧 Verificación de email requerida</p>
                    <p>Hemos enviado un enlace de verificación a tu correo electrónico. Por favor:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Revisa tu bandeja de entrada</li>
                      <li>Verifica también la carpeta de spam/correo no deseado</li>
                      <li>Haz clic en el enlace para activar tu cuenta</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mostrar errores */}
            {registerErrors.map((error, i) => (
              <Message message={error} key={i} />
            ))}
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <Label className="block text-gray-700 mb-1 text-base">Nombre de usuario</Label>
                <Input
                  type="text"
                  placeholder="Escribe tu nombre"
                  className="bg-[#dde6e2] rounded-md px-3 py-2 text-base placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
                  {...register("username")}
                />
                <p className="text-red-500 text-sm mt-1">{errors.username?.message}</p>
              </div>
              
              <div>
                <Label className="block text-gray-700 mb-1 text-base">Correo electrónico</Label>
                <Input
                  type="email"
                  placeholder="ramona@gmail.com"
                  className="bg-[#dde6e2] rounded-md px-3 py-2 text-base placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
                  {...register("email")}
                />
                <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
              </div>
              
              <div>
                <Label className="block text-gray-700 mb-1 text-base">Contraseña</Label>
                <Input
                  type="password"
                  placeholder="********"
                  className="bg-[#dde6e2] rounded-md px-3 py-2 text-base placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
                  {...register("password")}
                />
                <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
              </div>
              
              <div>
                <Label className="block text-gray-700 mb-1 text-base">Confirmar Contraseña</Label>
                <Input
                  type="password"
                  placeholder="********"
                  className="bg-[#dde6e2] rounded-md px-3 py-2 text-base placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
                  {...register("confirmPassword")}
                />
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword?.message}</p>
              </div>
              
              <Button 
                type="submit"
                className="bg-[#165a4c] text-white rounded-md px-4 py-3 text-base shadow-lg hover:bg-[#144736] transition mt-4"
                disabled={!!successMessage} //Deshabilitar botón después del registro exitoso
              >
                {successMessage ? "Registro Exitoso" : "Registrarse"}
              </Button>
            </form>
            
            <p className="mt-5 text-gray-500 text-center text-base">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-blue-500 hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
            
            {/* Enlace para reenviar email de verificación  */}
            {successMessage && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">¿No recibiste el email?</p>
                <button 
                  type="button"
                  className="text-blue-500 hover:underline text-sm font-medium"
                  onClick={() => {
                    //  reenviar el email
                    alert("Funcionalidad de reenvío de email por implementar");
                  }}
                >
                  Reenviar email de verificación
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Register;