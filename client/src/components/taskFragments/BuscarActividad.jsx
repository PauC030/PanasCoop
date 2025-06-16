import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui";
import { useSearch } from "../../context/searchContext";
import { TaskCard } from "../tasks/TaskCard";
import { useAuth } from "../../context/authContext";
import { useTasks } from "../../context/tasksContext"; 

export function BuscarActividad() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { searchTasks, results, loading } = useSearch();
  const { user } = useAuth();
  const { deleteTask, updateTask } = useTasks(); // Para operaciones instantáneas

  const handleBuscar = () => {
    searchTasks({
      q: search,
      place: location,
      estado: status,
      date: dateFilter,
    });

    // Hacer scroll suave hacia los resultados
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Auto-recarga cuando se monta el componente
  useEffect(() => {
    searchTasks({
      q: search,
      place: location,
      estado: status,
      date: dateFilter,
    });
  }, []);

  // Auto-recarga cuando cambian los filtros (opcional)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search || location || status || dateFilter) {
        searchTasks({
          q: search,
          place: location,
          estado: status,
          date: dateFilter,
        });
      }
    }, 500); // Espera 500ms después de que el usuario deje de escribir

    return () => clearTimeout(timeoutId);
  }, [search, location, status, dateFilter]);

  // Manejo instantáneo de eliminación para actividades propias
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete._id);
        setDeleteModalOpen(false);
        setTaskToDelete(null);
        // Actualizar resultados inmediatamente sin recargar
        searchTasks({
          q: search,
          place: location,
          estado: status,
          date: dateFilter,
        });
      } catch (error) {
        console.error("Error al eliminar la actividad:", error);
      }
    }
  };

  // Manejo instantáneo de actualización de estado para actividades propias
  const handleQuickUpdate = async (taskId, updates) => {
    try {
      await updateTask(taskId, updates);
      // Actualizar resultados inmediatamente
      searchTasks({
        q: search,
        place: location,
        estado: status,
        date: dateFilter,
      });
    } catch (error) {
      console.error("Error al actualizar la actividad:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Buscar Actividades
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra las actividades que más te interesen usando nuestros filtros avanzados
          </p>
        </div>

        {/* Search Form Card - Más delicado */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-2xl overflow-hidden mx-auto mb-8 max-w-5xl">
          <div className="bg-gray-200 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"/>
              </svg>
              Filtros de Búsqueda
            </h2>
          </div>
          
          <div className="p-6">
            {/* Búsqueda principal */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-gray-500" />
                <span>Buscar por palabra clave</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Ejemplo: alimentos, plaza, recolección, capacitación..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Filtros en grid horizontal - Más compactos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Filtro por fecha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>Fecha</span>
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full py-2.5 px-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                >
                  <option value="">Todas las fechas</option>
                  <option value="proximas">📅 Próximas actividades</option>
                  <option value="pasadas">📋 Actividades pasadas</option>
                </select>
              </div>

              {/* Filtro por lugar */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>Lugar</span>
                </label>
                <input
                  type="text"
                  placeholder="Plaza Central, Parque, Oficina..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2.5 px-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                />
              </div>

              {/* Filtro por estado */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                  <span>Estado</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full py-2.5 px-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                >
                  <option value="">Todos los estados</option>
                  <option value="promocionadas">⭐ Solo promocionadas</option>
                </select>
              </div>
            </div>

            {/* Botón de búsqueda - Más pequeño */}
            <div className="flex justify-center">
              <Button
                onClick={handleBuscar}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center gap-2"
              >
                Buscar Actividades
              </Button>
            </div>
          </div>
        </div>

        {/* Results Counter - Solo si hay resultados */}
        {!loading && results.length > 0 && (
          <div className="flex justify-center mb-6">
            <div className="bg-white shadow-md border border-gray-100 rounded-full px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7H5m14 14H5"/>
                  </svg>
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  {results.length} actividad{results.length !== 1 ? 'es' : ''} encontrada{results.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-base text-gray-600 font-medium">Buscando actividades...</p>
          </div>
        )}

        {/* Results Grid - CAMBIO PRINCIPAL: Ahora usa grid ordenado como el segundo código */}
        {!loading && (
          <div id="results-section">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m6-6h-6m-6 0h6m6-6V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2"/>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron actividades</h4>
                <p className="text-gray-500 text-center max-w-md text-sm">
                  Intenta ajustar tus filtros de búsqueda o prueba con términos diferentes
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((task) => {
                  // Solo mostrar badge de promoción si no es del usuario actual
                  const isPast = task.date && new Date(task.date) < new Date();
                   
                  return (
                    <div key={task._id} className="relative">
                      {/* Badge de "Finalizada" para actividades pasadas */}
                      {isPast && (
                         <div className="absolute top-2 right-2 z-10 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                          FINALIZADA
                        </div>
                      )}
                      <TaskCard
                        task={task}
                        showPromoBadge={task.isPromoted && !task.isOwner} // Solo mostrar si está promocionada Y no es mi tarea
                        showAttendanceButton={!isPast} 
                        refreshSearch={handleBuscar}
                        // Props adicionales para actividades propias
                        onQuickDelete={task.isOwner ? () => handleDeleteClick(task) : undefined}
                        onQuickUpdate={task.isOwner ? (updates) => handleQuickUpdate(task._id, updates) : undefined}
                        isPastActivity={isPast}
                        allowDetailsModal={true}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Confirmar eliminación
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  ¿Estás seguro de que quieres eliminar la actividad <span className="font-semibold">"{taskToDelete?.title}"</span>? 
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setTaskToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}