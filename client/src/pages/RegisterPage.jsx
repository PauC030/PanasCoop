import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import registerImage from '../assets/image login2.jpg';

function Register() {
  const { signup, errors: registerErrors, isAuthenticated, successMessage } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center p-9 py-20">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Logo/Brand 
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-800 mb-2">PanascOOP</h1>
          <p className="text-gray-600">Únete a nuestra comunidad cooperativa</p>
        </div>*/}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[20px]">
            
            {/* Left side - Registration Form */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                
                {/* Welcome Message */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Únete a nosotros!</h2>
                  <p className="text-gray-600">Crea tu cuenta y forma parte de la comunidad</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-3">
                      <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-green-800 font-bold">¡Registro exitoso!</h3>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-2">📧 Verificación de email requerida</p>
                          <p className="mb-2">Hemos enviado un enlace de verificación a tu correo. Por favor:</p>
                          <ul className="space-y-1 text-sm">
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                              Revisa tu bandeja de entrada
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                              Verifica también la carpeta de spam
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                              Haz clic en el enlace para activar tu cuenta
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Mensaje */}
                {registerErrors.map((error, i) => (
                  <Message message={error} key={i} />
                ))}

                {/* formulario de registro */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
                  <div>
                    <Label className="block text-gray-700 mb-2 text-base font-medium">
                      Nombre de usuario
                    </Label>
                    <Input
                      type="text"
                      placeholder="Ingresa tu nombre de usuario"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="block text-gray-700 mb-2 text-base font-medium">
                      Correo electrónico
                    </Label>
                    <Input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="block text-gray-700 mb-2 text-base font-medium">
                      Contraseña
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="block text-gray-700 mb-2 text-base font-medium">
                      Confirmar Contraseña
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  
                  {/* boton de registro */}
                  <div className="mt-19"/>
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg px-6 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!!successMessage}
                  >
                    {successMessage ? (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Registro Exitoso
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Crear cuenta
                      </span>
                    )}
                  </Button>
      
                </form>
                
                {/* Login Link */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link 
                      to="/login" 
                      className="text-teal-600 hover:text-teal-800 font-medium hover:underline transition-colors"
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
                
                
                {successMessage && (
                  <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">¿No recibiste el email?</p>
                    <button 
                      type="button"
                      className="inline-flex items-center text-teal-600 hover:text-teal-800 text-sm font-medium hover:underline transition-colors"
                      onClick={() => {
                        alert("Funcionalidad de reenvío de email por implementar");
                      }}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Reenviar email de verificación
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Diseño de imagen  */}
            <div className="lg:w-1/2 bg-gradient-to-br from-teal-600 to-teal-800 relative overflow-hidden">
              <img 
                src={registerImage} 
                alt="Imagen decorativa"
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/90 to-teal-800/90 flex items-center justify-center p-8">
                <div className="text-center text-white">
              <div className="mb-6">
                    <svg className="w-16 h-16 mx-auto mb-4 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>

                  <h2 className="text-3xl font-bold mb-4">
                    Únete a la comunidad
                  </h2>
                  <p className="text-xl text-teal-100 mb-6">
                    Vive la experiencia completa de PanascOOP
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-teal-200">
                    <span className="text-sm">🤝</span>
                    <span className="text-sm font-medium">Innovación social colectiva</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer 
        <div className="text-center mt-8 text-gray-500 text-sm">
          © 2024 PanascOOP - Plataforma de Gestión Cooperativa
        </div> */}
      </div>  
    </div>
  );
}

export default Register;