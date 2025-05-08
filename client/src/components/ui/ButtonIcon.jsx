
export function ButtonIcon({ onClick, children }) {
    return (
      <button
      className="p-1 md:p-1 hover:bg-gray-100 rounded-full transition-colors 
      inline-flex justify-center items-center text-xl md:text-base
      min-w-[40px] md:min-w-[32px] h-[40px] md:h-[32px]"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }