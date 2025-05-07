import { useState } from "react";
import { Button } from "../ui";

export function ConfigurarNotificaciones() {
  const [selectedActivity, setSelectedActivity] = useState("");
  const [anticipationDays, setAnticipationDays] = useState("");
  const [mensaje, setMensaje] = useState("");

  const actividades = [
    {
      id: 1,
      nombre: "Nombre de la actividad 1",
      fecha: "2026-10-15",
      lugar: "Parque Central",
    },
    {
      id: 2,
      nombre: "Nombre de la actividad 2",
      fecha: "2026-10-20",
      lugar: "Parque Central",
    },
    {
      id: 3,
      nombre: "Nombre de la actividad 3",
      fecha: "2026-10-25",
      lugar: "Parque Central",
    },
  ];

  const guardarConfiguracion = () => {
    if (!selectedActivity || !anticipationDays) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    setMensaje("¡Configuración guardada correctamente!");
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="bg-white p-6 min-h-screen">
      <h2 className="text-[#03673E] font-semibold text-lg mb-6">
        Notificaciones de Actividades Sociales
      </h2>

      <div className="border-2 rounded-md p-6 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Próximas actividades */}
        <div>
          <h3 className="text-black font-bold mb-4">Próximas Actividades</h3>
          {actividades.map((actividad) => (
            <div
              key={actividad.id}
              className="bg-[#e5eae6] p-4 rounded mb-3 shadow-sm text-black"
            >
              <p className="font-medium">{actividad.nombre}</p>
              <p>Fecha: {actividad.fecha}</p>
              <p>Lugar: {actividad.lugar}</p>
            </div>
          ))}
        </div>

        {/* Configuración de notificaciones */}
        <div>
          <h3 className="text-black font-bold mb-4">Configuración de Notificaciones</h3>

          <label className="block mb-2">Seleccionar Actividad</label>
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="bg-[#d3d3d3] text-black rounded px-3 py-2 mb-4 w-full outline-none"
          >
            <option value="">Seleccione una actividad</option>
            {actividades.map((actividad) => (
              <option
                key={actividad.id}
                value={actividad.id}
              >
                {actividad.nombre} - {actividad.fecha} - {actividad.lugar}
              </option>
            ))}
          </select>

          <label className="block mb-2">Tiempo de Anticipación (días):</label>
          <input
            type="number"
            placeholder="Ingrese el número de días"
            value={anticipationDays}
            onChange={(e) => setAnticipationDays(e.target.value)}
            className="bg-[#d3d3d3] text-black rounded px-3 py-2 mb-4 w-full outline-none placeholder:text-black"
          />

          <Button
            onClick={guardarConfiguracion}
            className="bg-gradient-to-r from-green-600 to-green-800 text-white px-4 py-2 rounded shadow hover:brightness-110"
          >
            Guardar Configuración
          </Button>

          {mensaje && <p className="mt-4 text-green-700 font-medium">{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}
