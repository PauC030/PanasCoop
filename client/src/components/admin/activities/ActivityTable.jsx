import { useState } from "react";
import { useAdminPanel } from "../../../context/adminPanelContext";
import { CheckIcon, XIcon, StarIcon, EyeIcon, TrashIcon } from "@heroicons/react/outline";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ActivityTable() {
  const { activities, loading, fetchActivities, approveActivity, rejectActivity, toggleActivityPromotion } = useAdminPanel();
  const [filters, setFilters] = useState({
    status: "",
    promoted: "",
    search: "",
    date: ""
  });
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchActivities(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      promoted: "",
      search: "",
      date: ""
    });
    fetchActivities({});
  };

  const handleApprove = async (id) => {
    await approveActivity(id);
    fetchActivities(filters);
  };

  const handleReject = async (id) => {
    const reason = prompt("Ingrese el motivo del rechazo:");
    if (reason) {
      await rejectActivity(id, reason);
      fetchActivities(filters);
    }
  };

  const handleTogglePromotion = async (id, isPromoted) => {
    await toggleActivityPromotion(id, !isPromoted);
    fetchActivities(filters);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Gestión de Actividades</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobadas</option>
              <option value="rejected">Rechazadas</option>
            </select>
            <select
              name="promoted"
              value={filters.promoted}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Todas las promociones</option>
              <option value="true">Promocionadas</option>
              <option value="false">No promocionadas</option>
            </select>
            <input
              type="text"
              name="search"
              placeholder="Buscar..."
              value={filters.search}
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
        <div className="overflow-x-visible"> {/* Cambiado de overflow-x-auto a overflow-x-visible */}
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Lugar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Promoción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Creador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-500 break-words">{activity.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {format(new Date(activity.date), "PPP", { locale: es })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 break-words">{activity.place}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                      activity.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status === 'approved' ? 'Aprobada' : 
                       activity.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTogglePromotion(activity._id, activity.isPromoted)}
                      className={`p-1 rounded-md ${
                        activity.isPromoted ? 'text-yellow-600 hover:bg-yellow-100' : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={activity.isPromoted ? 'Quitar promoción' : 'Promocionar'}
                    >
                      <StarIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 break-words">
                    {activity.user?.username || 'Desconocido'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      {activity.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(activity._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Aprobar"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(activity._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Rechazar"
                          >
                            <XIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedActivity(activity)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{selectedActivity.title}</h3>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedActivity.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fecha</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {format(new Date(selectedActivity.date), "PPPp", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Lugar</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedActivity.place}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedActivity.status}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Promoción</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedActivity.isPromoted ? 'Sí' : 'No'}
                    </p>
                  </div>
                </div>
                
                {selectedActivity.rejectionReason && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Motivo de rechazo</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedActivity.rejectionReason}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Creador</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedActivity.user?.username || 'Desconocido'} ({selectedActivity.user?.email || 'No email'})
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}