
export function ButtonIcon({ onClick, children }) {
    return (
      <button
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }