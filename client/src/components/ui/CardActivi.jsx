export function CardActivi({ children, className = "", isPromoted = false }) {
return (
  <div
    className={`
      block                /* asegura que tome el ancho completo disponible */
      w-full               /* usa todo el ancho del contenedor */
      ml-4                 /* margen izquierdo fijo (ajusta según prefieras) */
      max-w-full           /* no limites el ancho máximo */
      bg-white
      shadow-sm hover:shadow-md
      px-4 py-4
      rounded-md
      border-2
      ${isPromoted
        ? 'border-yellow-400 hover:border-yellow-500 hover:bg-gradient-to-r hover:from-white hover:to-yellow-50'
        : 'border-yellow-400 hover:border-yellow-500 hover:bg-gradient-to-r hover:from-white hover:to-yellow-50'
      }
      transition-all duration-300
      hover:-translate-y-[1px] hover:scale-[1.01]
      min-h-[80px]
      relative overflow-hidden group
      ${className}
    `}
  >

      {/* Borde decorativo superior */}
      <div className={`
        absolute top-0 left-0 right-0 h-1 
        ${isPromoted 
          ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600' 
          : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600'
        } 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
      `}></div>
      
      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-center space-y-0.5 sm:space-y-1 md:space-y-2">
        {children}
      </div>

      {/* Brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Indicador de promoción */}
      {isPromoted && (
        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}
