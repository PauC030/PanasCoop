import React, { useState } from 'react';

const actividadesMock = [
  {
    id: 1,
    titulo: 'Título de la actividad 1',
    descripcion: 'Descripción de la actividad 1',
    fecha: '2023-12-01',
    lugar: 'Lugar 2',
    responsable: 'Responsable 1',
    promocionada: true,
  },
  {
    id: 2,
    titulo: 'Título de la actividad 2',
    descripcion: 'Descripción de la actividad 2',
    fecha: '2023-12-02',
    lugar: 'Lugar 3',
    responsable: 'Responsable 2',
    promocionada: false,
  },
  {
    id: 3,
    titulo: 'Título de la actividad 3',
    descripcion: 'Descripción de la actividad 3',
    fecha: '2023-12-03',
    lugar: 'Lugar 4',
    responsable: 'Responsable 3',
    promocionada: true,
  },
];

export function ActividadesPromocionadas() {
  const [actividades, setActividades] = useState(actividadesMock);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  const handleTogglePromocion = (id) => {
    const actualizadas = actividades.map((act) =>
      act.id === id ? { ...act, promocionada: !act.promocionada } : act
    );
    setActividades(actualizadas);
  };

  const actividadesFiltradas = actividades.filter((act) => act.promocionada);

  return (
    <div className="text-black p-4">
      <h1 className="text-2xl font-bold mb-4">🔍 Aquí están las actividades promocionadas.</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actividadesFiltradas.map((actividad) => (
          <div
            key={actividad.id}
            className="relative p-4 border-2 border-yellow-500 rounded shadow bg-white"
          >
            {/* Etiqueta "Promocionada" */}
            <div className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-semibold px-2 py-1 rounded">
              Promocionada
            </div>

            <h2 className="text-base font-bold">{actividad.titulo}</h2>
            <p className="text-gray-500">Fecha: {actividad.fecha}</p>
            <p className="text-gray-500">Lugar: {actividad.lugar}</p>
            <p className="text-gray-500">Responsables: {actividad.responsable}</p>

            <div className="mt-2 flex flex-wrap justify-between items-center">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => setActividadSeleccionada(actividad)}
              >
                Ver Detalles
              </button>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">Desactivar promoción</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={actividad.promocionada}
                    onChange={() => handleTogglePromocion(actividad.id)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 relative" />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detalles */}
      {actividadSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">{actividadSeleccionada.titulo}</h2>
            <p><strong>Descripción:</strong> {actividadSeleccionada.descripcion}</p>
            <p><strong>Fecha:</strong> {actividadSeleccionada.fecha}</p>
            <p><strong>Lugar:</strong> {actividadSeleccionada.lugar}</p>
            <p><strong>Responsables:</strong> {actividadSeleccionada.responsable}</p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setActividadSeleccionada(null)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActividadesPromocionadas;
