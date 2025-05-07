import React, { useState } from 'react';

const actividadesMock = [
  {
    id: 1,
    titulo: 'Título de la actividad 1',
    descripcion: 'Descripción de la actividad 1',
    fecha: '2023-12-01',
    lugar: 'Lugar 2',
    responsable: 'Responsable 1'
  },
  {
    id: 2,
    titulo: 'Título de la actividad 2',
    descripcion: 'Descripción de la actividad 1',
    fecha: '2023-12-01',
    lugar: 'Lugar 2',
    responsable: 'Responsable 1'
  },
  {
    id: 3,
    titulo: 'Título de la actividad 3',
    descripcion: 'Descripción de la actividad 1',
    fecha: '2023-12-01',
    lugar: 'Lugar 2',
    responsable: 'Responsable 1'
  },
];

export function ListaActividades() {
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [asistenciaConfirmada, setAsistenciaConfirmada] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarCancelar, setMostrarCancelar] = useState(false);

  const handleVerDetalles = (actividad) => {
    setActividadSeleccionada(actividad);
  };

  const handleAsistir = (actividadId) => {
    setMostrarFormulario(true);
    setActividadSeleccionada(actividadId);
  };

  const handleConfirmarAsistencia = () => {
    setAsistenciaConfirmada({ ...asistenciaConfirmada, [actividadSeleccionada]: true });
    setMostrarFormulario(false);
  };

  const handleCancelarAsistencia = () => {
    setMostrarCancelar(true);
  };

  const handleConfirmarCancelacion = () => {
    const nuevaAsistencia = { ...asistenciaConfirmada };
    delete nuevaAsistencia[actividadSeleccionada];
    setAsistenciaConfirmada(nuevaAsistencia);
    setMostrarCancelar(false);
  };

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Lista de actividades</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actividadesMock.map((actividad) => (
          <div
            key={actividad.id}
            className={`p-4 border rounded shadow ${
              asistenciaConfirmada[actividad.id] ? 'border-blue-500' : ''
            }`}
          >
            <h2 className="text-lg font-bold">{actividad.titulo}</h2>
            <p className="text-gray-500">Descripción: {actividad.descripcion}</p>
            <p className="text-gray-500">Fecha: {actividad.fecha}</p>
            <p className="text-gray-500">Lugar: {actividad.lugar}</p>
            <p className="text-gray-500">Responsables: {actividad.responsable}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => handleVerDetalles(actividad)}
              >
                Ver Detalles
              </button>
              {asistenciaConfirmada[actividad.id] ? (
                <>
                  <span className="text-green-700 font-semibold">Asistencia Confirmada</span>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setActividadSeleccionada(actividad.id);
                      handleCancelarAsistencia();
                    }}
                  >
                    Cancelar Asistencia
                  </button>
                </>
              ) : (
                <button
                  className="bg-gray-100 border px-3 py-1 rounded"
                  onClick={() => handleAsistir(actividad.id)}
                >
                  Asistir a actividad
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detalles */}
      {actividadSeleccionada && typeof actividadSeleccionada === 'object' && (
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

      {/* Modal Confirmar Asistencia */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">Asistir a la Actividad</h2>
            <p className="mb-4">¿Estás seguro que deseas Asistir a esta Actividad?</p>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full mb-2 p-2 bg-gray-100 border rounded"
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="w-full mb-4 p-2 bg-gray-100 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleConfirmarAsistencia}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cancelar Asistencia */}
      {mostrarCancelar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">Cancelar Asistencia</h2>
            <p className="mb-4">¿Estás seguro que deseas Cancelar tu Asistencia en esta Actividad?</p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setMostrarCancelar(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleConfirmarCancelacion}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaActividades;