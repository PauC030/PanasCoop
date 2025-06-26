import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { CheckCircle, XCircle, Mail, ArrowRight, RefreshCw, Handshake, Shield, Award, AlertCircle } from 'lucide-react';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationEmail, user } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);
  const [email, setEmail] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(0);
  
  // Estados de animación mejorados
  const [showContent, setShowContent] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Estados de validación de email
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado en la URL');
      setShowResendForm(true);
      // Mostrar contenido después de establecer el error
      setTimeout(() => {
        setShowContent(true);
        setTimeout(() => setShowActions(true), 500);
      }, 100);
      return;
    }

    const handleVerification = async () => {
      try {
        setStatus('verifying');
        setMessage('Verificando tu cuenta...');
        
        // Mostrar el estado de verificación primero
        setTimeout(() => setShowContent(true), 100);
        
        // Pequeño delay para mostrar el estado de carga
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const result = await verifyEmail(token);
        
        if (result && result.success) {
          setStatus('success');
          setMessage(result.message || 'Email verificado exitosamente');
          
          // Obtener el nombre del usuario
          if (result.user?.displayName) {
            setUserName(result.user.displayName);
          } else if (result.user?.name || result.user?.username) {
            setUserName(result.user.name || result.user.username);
          } else if (user?.displayName) {
            setUserName(user.displayName);
          } else if (user?.name || user?.username) {
            setUserName(user.name || user.username);
          }
          
          // Mostrar acciones después del éxito
          setTimeout(() => setShowActions(true), 500);
          
          // Iniciar countdown para redirección
          setRedirectCountdown(5);
          const countdownInterval = setInterval(() => {
            setRedirectCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                navigate('/welcome');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          return () => clearInterval(countdownInterval);
        } else {
          throw new Error(result?.message || 'Error al verificar el email');
        }
      } catch (error) {
       
        setStatus('error');
        setMessage(error.message || 'Error al verificar el email');
        setShowResendForm(true);
        // Mostrar acciones después del error
        setTimeout(() => setShowActions(true), 500);
      }
    };

    handleVerification();
  }, [searchParams, verifyEmail, navigate, user]);

  // Validación de email en tiempo real
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue.trim()) {
      setEmailError('El email es requerido');
      setIsEmailValid(false);
      return false;
    }
    if (!emailRegex.test(emailValue)) {
      setEmailError('Por favor ingresa un email válido');
      setIsEmailValid(false);
      return false;
    }
    setEmailError('');
    setIsEmailValid(true);
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleResendEmail = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }
    
    setResendLoading(true);
    try {
      const result = await resendVerificationEmail(email);
      if (result && result.success !== false) {
        setMessage('Email de verificación enviado exitosamente. Revisa tu bandeja de entrada.');
        setShowResendForm(false);
        setStatus('sent');
      } else {
        setEmailError(result?.message || 'Error al enviar email');
      }
    } catch (error) {
      setEmailError('Error al enviar email de verificación');
    } finally {
      setResendLoading(false);
    }
  };

  const handleManualRedirect = () => {
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
    
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center">
          
          {/* Estado: Verificando */}
          {status === 'verifying' && (
            <div className={`transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Header integrado en el contenido */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-700 to-emerald-700 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 shadow-lg">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Panasc<span className="text-teal-700">OO</span><span className="text-emerald-700">p</span>
                    </h1>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full mb-6 shadow-sm">
                <RefreshCw className="w-4 h-4 text-blue-700 mr-2 animate-spin" />
                <span className="text-sm font-medium text-blue-800">Verificando</span>
              </div>
              
              <div className="relative mb-8">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg border-4 border-white">
                  <RefreshCw className="h-12 w-12 text-blue-600 animate-spin" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
                Verificando tu 
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700"> cuenta</span>
              </h1>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm max-w-md mx-auto">
                <p className="text-blue-700 leading-relaxed">
                  {message || 'Por favor espera mientras confirmamos tu email...'}
                </p>
              </div>
            </div>
          )}

          {/* Estado: Éxito */}
          {status === 'success' && (
            <div className={`transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Header integrado en el contenido */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-700 to-emerald-700 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 shadow-lg">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Panasc<span className="text-teal-700">OO</span><span className="text-emerald-700">p</span>
                    </h1>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full mb-6 shadow-sm">
                <Award className="w-4 h-4 text-green-700 mr-2 animate-pulse" />
                <span className="text-sm font-medium text-green-800">Verificación Exitosa</span>
              </div>

              <div className="relative mb-8">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg border-4 border-white">
                  <CheckCircle className="h-12 w-12 text-green-600 animate-bounce" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
                ¡Bienvenido{userName && `, `}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-700">
                  {userName || 'a PanascOOp'}
                </span>!
              </h1>
              
              <div className="text-4xl mb-6">🎉</div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 shadow-sm mb-6 max-w-lg mx-auto">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  Tu cuenta ha sido verificada exitosamente
                </h3>
                <p className="text-green-700 mb-4 leading-relaxed">
                  {message}
                </p>
                {redirectCountdown > 0 && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-green-600 bg-green-100 rounded-lg p-3">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Redirigiendo en {redirectCountdown} segundos...</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-lg mx-auto">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">✨</div>
                  <div className="text-left">
                    <h4 className="font-medium text-blue-800 mb-1">
                      ¡Ya puedes comenzar!
                    </h4>
                    <p className="text-sm text-blue-700">
                      Explora todas las funcionalidades de PanascOOp y comienza a gestionar tus tareas de manera eficiente.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`transform transition-all duration-700 ${showActions ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
                <button 
                  onClick={handleManualRedirect}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  <span>Ir a mis Tareas Ahora</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* Estado: Error */}
          {status === 'error' && (
            <div className={`transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Header integrado en el contenido */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-700 to-emerald-700 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 shadow-lg">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Panasc<span className="text-teal-700">OO</span><span className="text-emerald-700">p</span>
                    </h1>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-full mb-6 shadow-sm">
                <AlertCircle className="w-4 h-4 text-red-700 mr-2" />
                <span className="text-sm font-medium text-red-800">Error de Verificación</span>
              </div>
              
              <div className="relative mb-8">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-red-100 to-pink-100 shadow-lg border-4 border-white">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
                Error en la 
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-pink-700"> verificación</span>
              </h1>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm mb-8 max-w-lg mx-auto">
                <p className="text-red-700 leading-relaxed">
                  {message}
                </p>
              </div>

              {showResendForm && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg p-6 mb-8 max-w-lg mx-auto">
                  <div className="flex items-start space-x-3 mb-4">
                    <Mail className="w-6 h-6 text-teal-600 mt-1" />
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-gray-800 mb-1">
                        ¿Necesitas un nuevo enlace?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ingresa tu email para recibir un nuevo enlace de verificación
                      </p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleResendEmail} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        placeholder="tu-email@ejemplo.com"
                        value={email}
                        onChange={handleEmailChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                          emailError 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : isEmailValid 
                              ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                              : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
                        }`}
                        required
                      />
                      {emailError && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {emailError}
                        </p>
                      )}
                      {isEmailValid && !emailError && (
                        <p className="mt-2 text-sm text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Email válido
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={resendLoading || !isEmailValid}
                      className="w-full bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                      {resendLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Reenviar Email de Verificación</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              <div className={`space-y-4 transform transition-all duration-700 ${showActions ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
                <button 
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-4"
                >
                  Ir al Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center px-6 py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 hover:border-teal-700 hover:text-teal-700 font-semibold rounded-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Registrarse de nuevo
                </button>
              </div>
            </div>
          )}

          {/* Estado: Email enviado */}
          {status === 'sent' && (
            <div className={`transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Header integrado en el contenido */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-700 to-emerald-700 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 shadow-lg">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Panasc<span className="text-teal-700">OO</span><span className="text-emerald-700">p</span>
                    </h1>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full mb-6 shadow-sm">
                <Mail className="w-4 h-4 text-blue-700 mr-2 animate-pulse" />
                <span className="text-sm font-medium text-blue-800">Email Enviado</span>
              </div>
              
              <div className="relative mb-8">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg border-4 border-white">
                  <Mail className="h-12 w-12 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
                Email 
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700"> enviado</span>
              </h1>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm mb-8 max-w-lg mx-auto">
                <p className="text-blue-700 leading-relaxed">
                  {message}
                </p>
              </div>

              <div className={`transform transition-all duration-700 ${showActions ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
                <button 
                  onClick={() => navigate('/login')}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  <span>Ir al Login</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-sm text-gray-500">
          © 2024 PanascOOp - Plataforma de Gestión Cooperativa
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;