import { useState } from "react";
import { useAdminPanel } from "../../../context/adminPanelContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TrashIcon } from "@heroicons/react/outline";
import UserDetailsModal from "../users/UserDetailsModal";

export default function AttendanceTable() {
  const { attendances, loading, fetchAttendances, deleteAttendance } = useAdminPanel();
  const [filters, setFilters] = useState({
    activityId: "",
    userId: "",
    date: ""
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchAttendances(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      activityId: "",
      userId: "",
      date: ""
    });
    fetchAttendances({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro de asistencia?")) {
      await deleteAttendance(id);
      fetchAttendances(filters);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Gestión de Asistencias</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="activityId"
              placeholder="ID Actividad"
              value={filters.activityId}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="userId"
              placeholder="ID Usuario"
              value={filters.userId}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md"
            />
            <button
              onClick={handleApplyFilters}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Filtrar
            </button>
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendances.map((attendance) => (
              <tr key={attendance._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{attendance.task?.title || 'Actividad eliminada'}</div>
                  <div className="text-sm text-gray-500">
                    {attendance.task?.date ? format(new Date(attendance.task.date), "PPP", { locale: es }) : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{attendance.user?.username || 'Usuario eliminado'}</div>
                  <div className="text-sm text-gray-500">{attendance.user?.email || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(attendance.createdAt), "PPPp", { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(attendance._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

