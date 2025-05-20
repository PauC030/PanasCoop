import React, { useState } from 'react';
import { Button } from '../ui';

export function GestionarAsistencia() {
  const [attendees, setAttendees] = useState([
    { id: 1, name: 'pepito perez', email: 'Pepito@gmail.com' },
    { id: 2, name: 'pepito perez', email: 'Pepito@gmail.com' },
    { id: 3, name: 'pepito perez', email: 'Pepito@gmail.com' },
    { id: 4, name: 'pepito prez', email: 'Pepito@gmail.com' },
  ]);

  const [exportLink, setExportLink] = useState('');
  const [showExportCard, setShowExportCard] = useState(false);

  const handleEdit = (id) => {
    alert(`Editar asistente con ID: ${id}`);
  };

  const handleDelete = (id) => {
    const filtered = attendees.filter(attendee => attendee.id !== id);
    setAttendees(filtered);
  };

  const convertToCSV = (data) => {
    const header = ['Nombre', 'Correo Electronico'];
    const rows = data.map(({ name, email }) => [name, email]);

    const csvContent = [header, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  };

  const handleExport = () => {
    const csvData = convertToCSV(attendees);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    setExportLink(url);
    setShowExportCard(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportLink).then(() => {
      alert('¡Enlace copiado al portapapeles!');
    });
  };

  const closeCard = () => setShowExportCard(false);

  return (
    <div className=" p-6 bg-white min-h-screen text-black relative">
      <h1 className="text-xl font-semibold text-green-700 mb-4">✅ Gestión de asistencia</h1>

      <div className="bg-white shadow-xl p-4 rounded-md border-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Lista de Actividades</h2>
          <Button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleExport}
          >
            Exportar Lista
          </Button>
        </div>

        <table className="w-full border-collapse text-black">
          <thead>
            <tr className="bg-gray-200 text-left text-sm">
              <th className="py-2 px-4 font-semibold">Nombre</th>
              <th className="py-2 px-4 font-semibold">Correo Electrónico</th>
              <th className="py-2 px-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id} className="border-t border-gray-200 text-sm">
                <td className="py-2 px-4">{attendee.name}</td>
                <td className="py-2 px-4">{attendee.email}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                    onClick={() => handleEdit(attendee.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(attendee.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <Button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Agregar asistentes
          </Button>
        </div>
      </div>

      {/* Tarjeta flotante con overlay */}
      {showExportCard && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center"
          onClick={closeCard}
        >
          <div
            className="bg-white border border-gray-300 shadow-xl rounded-md p-6 w-96 relative z-50 flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeCard}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold mb-4">Lista Exportada</h3>

            <div className="text-sm mb-4 break-words text-blue-700 underline bg-[#d3d3d3] rounded-md px-4 py-2 w-full">
              <a
                href={exportLink}
                download="asistentes.csv"
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargar asistentes.csv
              </a>
            </div>

            <Button
              onClick={handleCopy}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Copiar Enlace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
