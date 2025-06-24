import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Users, Heart, Handshake, Target, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const WelcomePage = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Secuencia de animaciones escalonadas más fluida
    const timers = [
      setTimeout(() => setShowHeader(true), 100),
      setTimeout(() => setShowContent(true), 400),
      setTimeout(() => setShowCards(true), 800),
      setTimeout(() => setShowButton(true), 1200),
      setTimeout(() => setShowMotivational(true), 1600)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const handleStart = () => {
    navigate('/tasks');
  };

  const getUserDisplayName = () => {
    // Priorizar el displayName (nombre con el que se registró)
    if (user?.displayName && user.displayName.trim() !== '') {
      return user.displayName;
    }
    // Si no hay displayName, buscar en otros campos posibles
    if (user?.name && user.name.trim() !== '') {
      return user.name;
    }
    if (user?.firstName) {
      return user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
    }
    if (user?.username && user.username.trim() !== '') {
      return user.username;
    }
    // Último recurso: extraer del email
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'Usuario';
  };

  const getGenderBasedGreeting = () => {
    // Verificar si hay información de género en el usuario
    if (user?.gender) {
      if (user.gender.toLowerCase() === 'female' || user.gender.toLowerCase() === 'mujer' || user.gender.toLowerCase() === 'f') {
        return 'Bienvenida';
      } else if (user.gender.toLowerCase() === 'male' || user.gender.toLowerCase() === 'hombre' || user.gender.toLowerCase() === 'm') {
        return 'Bienvenido';
      }
    }

    // Si no hay información de género, intentar deducir del nombre
    const name = getUserDisplayName().toLowerCase();
    
    // Nombres femeninos comunes
    const femaleNames = [
      'maria', 'ana', 'carmen', 'laura', 'elena', 'patricia', 'sandra', 'monica', 'cristina', 'silvia',
      'rosa', 'pilar', 'teresa', 'angeles', 'mercedes', 'julia', 'dolores', 'isabel', 'raquel', 'antonia',
      'francisca', 'beatriz', 'sara', 'esperanza', 'amparo', 'soledad', 'gloria', 'concepcion', 'manuela',
      'josefa', 'margarita', 'encarnacion', 'montserrat', 'nieves', 'rocio', 'victoria', 'aurora', 'consuelo',
      'andrea', 'sofia', 'lucia', 'paula', 'alejandra', 'natalia', 'claudia', 'valeria', 'adriana', 'carolina',
      'gabriela', 'daniela', 'paola', 'fernanda', 'lorena', 'marcela', 'veronica', 'diana', 'catalina', 'mariana'
    ];

    // Nombres masculinos comunes
    const maleNames = [
      'antonio', 'manuel', 'jose', 'francisco', 'david', 'juan', 'javier', 'daniel', 'carlos', 'miguel',
      'alejandro', 'fernando', 'luis', 'sergio', 'pablo', 'jorge', 'rafael', 'angel', 'andres', 'adrian',
      'oscar', 'pedro', 'alberto', 'victor', 'mario', 'diego', 'ricardo', 'ivan', 'raul', 'eduardo',
      'roberto', 'marcos', 'jesus', 'cristian', 'ruben', 'martin', 'gonzalo', 'enrique', 'ignacio', 'cesar',
      'santiago', 'sebastian', 'nicolas', 'gabriel', 'leonardo', 'emilio', 'hugo', 'jaime', 'alvaro', 'rodrigo'
    ];

    // Obtener el primer nombre
    const firstName = name.split(' ')[0];

    if (femaleNames.includes(firstName)) {
      return 'Bienvenida';
    } else if (maleNames.includes(firstName)) {
      return 'Bienvenido';
    }

    // Si no se puede determinar, usar forma neutral
    return 'Bienvenido/a';
  };

  const cardData = [
    {
      id: 1,
      icon: Heart,
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-700',
      title: 'Crear Actividades',
      description: 'Desarrolle iniciativas solidarias y compártalas con la comunidad para generar impacto positivo.'
    },
    {
      id: 2,
      icon: Users,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
      title: 'Participar',
      description: 'Únase a actividades existentes y contribuya con su tiempo y talento a causas importantes.'
    },
    {
      id: 3,
      icon: Target,
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-700',
      title: 'Interactuar',
      description: 'Conecte con otros voluntarios, comparta experiencias y construya una red solidaria.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden" style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%', minHeight: '125vh' }}>
      {/* Elementos decorativos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Header corporativo con animación */}
      <div className={`bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50 transform transition-all duration-700 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-emerald-700 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 shadow-lg">
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Panasc<span className="text-teal-700">OO</span><span className="text-emerald-700">p</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Plataforma de Actividades Solidarias</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 animate-pulse" />
              <span>Plataforma Segura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center">
          
          {/* Contenido principal con animación */}
          <div className={`transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            
            {/* Mensaje de bienvenida */}
            <div className="mb-8 sm:mb-12">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-full mb-4 sm:mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <Award className="w-4 h-4 text-teal-700 mr-2 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-teal-800">Acceso Autorizado</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-4 leading-tight">
                {getGenderBasedGreeting()},{' '}
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-emerald-700 animate-pulse">
                  {getUserDisplayName()}
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
                Ya eres parte de nuestra comunidad solidaria. Aquí encontrarás un espacio para compartir tus iniciativas, unirte a causas importantes y conectar con otros voluntarios apasionados.

              </p>
            </div>

            {/* Información de funcionalidades con animaciones escalonadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-5xl mx-auto">
              {cardData.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.id}
                    className={`p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-500 cursor-pointer group transform hover:-translate-y-2 ${
                      showCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: showCards ? `${index * 200}ms` : '0ms' 
                    }}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`w-10 sm:w-12 h-10 sm:h-12 ${card.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <IconComponent className={`w-5 sm:w-6 h-5 sm:h-6 ${card.iconColor} ${hoveredCard === card.id ? 'animate-bounce' : ''}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-teal-700 transition-colors duration-300">{card.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{card.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Botón de acción con animación */}
            <div className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 sm:mb-12 transform transition-all duration-700 ${showButton ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
              <button
                onClick={handleStart}
                className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 w-full sm:w-auto"
              >
                <span className="text-sm sm:text-base"> Inicio </span>
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

            </div>

            {/* Mensaje motivacional con animación */}
            <div className={`p-4 sm:p-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 shadow-sm hover:shadow-md transition-all duration-500 transform ${showMotivational ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-teal-600 mr-2 animate-pulse" />
                <h3 className="font-semibold text-teal-900 text-sm sm:text-base">¡Juntos Podemos Más!</h3>
              </div>
              <p className="text-teal-700 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                Cada acción solidaria cuenta. Su participación ayuda a construir una comunidad más fuerte y unida.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS adicionales para animaciones personalizadas */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slideInFromTop {
          animation: slideInFromTop 0.7s ease-out forwards;
        }
      `}</style>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-sm text-gray-500">
          © 2024 PanascOOp - Plataforma de Gestión Cooperativa
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;