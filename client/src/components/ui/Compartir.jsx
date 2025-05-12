import compartirImage from '../../assets/Compartir.png';

 export function BotonCompartir({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded hover:bg-gray-200 active:scale-95 transition"
      aria-label="Compartir"
    >
      <img
        src={compartirImage}
        alt="Compartir"
        className="h-6 w-6 hover:scale-110 transition-transform"
      />
    </button>
 
  )}