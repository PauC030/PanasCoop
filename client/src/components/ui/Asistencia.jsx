
import  Asistenciaimg from "../../assets/Asistencia.png"

 export function Asistenciaimg({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded hover:bg-gray-200 active:scale-95 transition"
      aria-label="Asistir"
    >
      <img
        src={Asistenciaimg}
        alt="Compartir"
        className="h-6 w-6 hover:scale-110 transition-transform"
      />
    </button>
 
  )}