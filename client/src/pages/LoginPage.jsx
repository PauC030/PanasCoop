import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { PasswordResetModal } from "../components/PasswordResetModal"; 
import { loginSchema } from "../schemas/auth";
import loginImage from '../assets/image login2.jpg';

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPasswordReset, setShowPasswordReset] = useState(false); 
  
  const onSubmit = (data) => signin(data);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center p-9 py-20">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[550px]">
            
            {/* Left side - Login Form */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                
                {/* Welcome Message */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido!</h2>
                  <p className="text-gray-600">Inicia sesión para acceder a tu cuenta</p>
                </div>

                {/* Error Messages */}
                {loginErrors.map((error, i) => (
                  <Message message={error} key={i} />
                ))}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label className="block text-gray-700 mb-2 text-base font-medium">
                      Correo electrónico
                    </Label>
                    <Input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      {...register("email", { required: true})}
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
                      {...register("password", { required: true, minLength: 6 })}
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

                  {/* Login Button */}
                 <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg px-6 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                   <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                   <span>Iniciar sesión</span>
                     </div>
                  </Button>

                </form>

                {/* Links Section - Organized */}
                <div className="mt-6 space-y-3">
                  {/* Forgot Password Link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowPasswordReset(true)}
                      className="text-sm text-teal-600 hover:text-teal-800 hover:underline font-medium transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      ¿No tienes una cuenta?{" "}
                      <Link 
                        to="/register" 
                        className="text-teal-600 hover:text-teal-800 font-medium hover:underline transition-colors"
                      >
                        Regístrate aquí
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Image/Brand */}
            <div className="lg:w-1/2 bg-gradient-to-br from-teal-600 to-teal-800 relative overflow-hidden">
              <img 
                src={loginImage} 
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
                    Conectamos comunidades
                  </h2>
                  <p className="text-xl text-teal-100 mb-6">
                    Descubre todo lo que PanascOOP tiene para ofrecerte
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
      </div>  

      {/* Password Reset Modal */}
      <PasswordResetModal 
        isOpen={showPasswordReset}
        onClose={() => setShowPasswordReset(false)}
      />
    </div>
  );
}