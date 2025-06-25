import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const EmailVerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, isAuthenticated } = useAuth();

  useEffect(() => {
    const verifyUserEmail = async () => {
      // Obtener el token de la URL
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');

      if (!token) {
        setVerificationStatus('error');
        setMessage('Token de verificación no encontrado en la URL');
        return;
      }

      try {
        const result = await verifyEmail(token);
        
        if (result.success) {
          setVerificationStatus('success');
          setMessage(result.message || 'Email verificado exitosamente');
          
          // Redirigir al dashboard o página principal después de 3 segundos
          setTimeout(() => {
            navigate('/dashboard'); // Cambia esta ruta según tu aplicación
          }, 3000);
        } else {
          setVerificationStatus('error');
          setMessage(result.message || 'Error al verificar el email');
        }
      } catch (error) {
        setVerificationStatus('error');
        setMessage('Error interno al verificar el email');
      }
    };
    // Si ya está autenticado, redirigir
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    verifyUserEmail();
  }, [location, verifyEmail, navigate, isAuthenticated]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificando tu email...</h2>
            <p className="text-gray-600">Por favor espera mientras verificamos tu cuenta.</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">¡Email Verificado!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Serás redirigido automáticamente en unos segundos...</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Dashboard
            </button>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Error de Verificación</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/register')}
                className="block w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrarse Nuevamente
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="block w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;