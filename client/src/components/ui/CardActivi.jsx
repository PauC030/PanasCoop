export function CardActivi({ children, className = "", isPromoted = false }) {
  return (
    <div
      className={`
        w-full
        bg-white
        shadow-lg
        hover:shadow-xl
        px-2
        py-3
        sm:px-3
        sm:py-4
        md:px-4
        md:py-5
        lg:px-5
        lg:py-6
        ml-2 sm:ml-3 md:ml-4 lg:ml-5
        rounded-xl
        border-2
        ${isPromoted 
          ? 'border-yellow-400 hover:border-yellow-500 hover:bg-gradient-to-r hover:from-white hover:to-yellow-50' 
          : 'border-yellow-400 hover:border-yellow-500 hover:bg-gradient-to-r hover:from-white hover:to-yellow-50'
        }
        transition-all
        duration-300
        hover:-translate-y-1
        hover:scale-[1.02]
        min-h-[120px]
        sm:min-h-[140px]
        md:min-h-[160px]
        lg:min-h-[180px]
        relative
        overflow-hidden
        group
        mb-3
        sm:mb-4
        md:mb-5
        ${className}
      `}
    >
      {/* Borde decorativo superior */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isPromoted 
          ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600' 
          : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600' 
      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Contenido optimizado para formato horizontal */}
      <div className="relative z-10 h-full flex flex-col justify-center space-y-2 sm:space-y-3 md:space-y-4">
        {children}
      </div>
      
      {/* Efecto de brillo sutil horizontal */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Indicador de promoción si aplica */}
      {isPromoted && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}