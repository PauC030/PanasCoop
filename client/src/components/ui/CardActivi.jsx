export function CardActivi({ children, className = "", isPromoted = false }) {
  return (
    <div
      className={`
        w-full
        max-w-md
        sm:max-w-lg
        md:max-w-2xl
        lg:max-w-4xl
        xl:max-w-5xl
        ml-6
        sm:ml-8
        md:ml-10
        lg:ml-12
        mr-4
        sm:mr-6
        md:mr-8
        bg-white
        shadow-lg
        hover:shadow-2xl
        px-6
        py-4
        sm:px-8
        sm:py-5
        md:px-10
        md:py-6
        rounded-2xl
        border-2
        ${isPromoted 
          ? 'border-yellow-400 hover:border-yellow-500 hover:bg-gradient-to-br hover:from-white hover:to-yellow-50' 
          : 'border-yellow-400 hover:border-yellow-500 hover:bg-gradient-to-br hover:from-white hover:to-yellow-50'
        }
        transition-all
        duration-300
        hover:-translate-y-1
        hover:scale-[1.01]
        min-h-[180px]
        sm:min-h-[200px]
        md:min-h-[220px]
        relative
        overflow-hidden
        group
        mb-4
        sm:mb-5
        md:mb-6
        ${className}
      `}
    >
      {/* Borde decorativo superior */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isPromoted 
          ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600' 
          : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600' 
      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Contenido con más espacio */}
      <div className="relative z-10 h-full flex flex-col justify-between space-y-4 sm:space-y-5 md:space-y-6">
        {children}
      </div>
      
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}