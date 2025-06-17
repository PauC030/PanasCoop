
import { useState, useEffect } from "react";
import { Button } from "../ui";
import { useNotifications } from "../../context/NotificationsContext";
import axios from "../../api/axios";
import { useLocation } from "react-router-dom";

export function ConfigurarNotificaciones() {
  console.log("MONTANDO COMPONENTE ConfigurarNotificaciones");
  
  const [selectedActivity, setSelectedActivity] = useState("");
  const [anticipationDays, setAnticipationDays] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [confirmedTasks, setConfirmedTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const location = useLocation();

  // Leer taskId de la URL y seleccionarlo por defecto
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const taskId = params.get("taskId");
    if (taskId) setSelectedActivity(taskId);
  }, [location.search]);

  const {
    notifications = [], // Valor por defecto
    loading = false,
    error,
    saveNotificationConfig,
    setError,
  } = useNotifications() || {}; // Verificación adicional

  console.log("notifications:", notifications, "loading:", loading, "error:", error);

  // Función auxiliar para verificar si una tarea es seleccionable (futura)
  const isTaskSelectable = (taskDate) => {
    if (!taskDate) return false;
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDateOnly = new Date(taskDate);
      taskDateOnly.setHours(0, 0, 0, 0);
      
      return taskDateOnly > today;
    } catch (error) {
      console.error("Error al verificar fecha:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchConfirmedTasks = async () => {
      setLoadingTasks(true);
      if (setError) setError(null);
      setMensaje("");
      
      try {
        console.log("🔄 Iniciando petición al backend...");
        
        const timestamp = new Date().getTime();
        const response = await axios.get(`/attendances/mis-asistencias?t=${timestamp}`);
        console.log("Respuesta de /attendances/mis-asistencias:", response.data);
      
        // Verificar que tenemos datos válidos
        if (!response.data) {
          throw new Error("No se recibieron datos del servidor");
        }

        if (!Array.isArray(response.data)) {
          console.error("Datos recibidos:", response.data);
          throw new Error("Los datos recibidos no son un array");
        }

        console.log(`Cantidad de asistencias recibidas: ${response.data.length}`);

        // Validar cada asistencia más estrictamente
        const validAttendances = response.data.filter((attendance, index) => {
          console.log(`🔍 Validando asistencia ${index + 1}:`, {
            id: attendance?._id,
            hasTask: !!attendance?.task,
            taskId: attendance?.task?._id,
            taskTitle: attendance?.task?.title,
            taskDate: attendance?.task?.date
          });
          
          return attendance && 
                 attendance._id && 
                 attendance.task && 
                 attendance.task._id &&
                 attendance.task.title &&
                 attendance.task.date;
        });

        console.log(`✅ Asistencias válidas: ${validAttendances.length}`);

        if (validAttendances.length === 0) {
          setConfirmedTasks([]);
          setMensaje("No tienes actividades confirmadas o las actividades no tienen fechas válidas");
          return;
        }

        // Mapear las tareas con mejor manejo de errores
        const tasksWithAttendance = validAttendances.map((attendance) => {
          const task = {
            _id: attendance.task._id,
            title: attendance.task.title || "Sin título",
            description: attendance.task.description || "Sin descripción",
            date: attendance.task.date,
            location: attendance.task.location || "Sin ubicación",
            _attendanceId: attendance._id,
            _confirmedAt: attendance.createdAt
          };
          
          console.log(`📝 Tarea mapeada:`, {
            id: task._id,
            title: task.title,
            date: task.date,
            isSelectable: isTaskSelectable(task.date)
          });
          
          return task;
        });

        // Eliminar duplicados por ID de tarea
        const uniqueTasks = [];
        const seenIds = new Set();
        
        tasksWithAttendance.forEach(task => {
          if (!seenIds.has(task._id)) {
            seenIds.add(task._id);
            uniqueTasks.push(task);
          }
        });

        // Ordenar por fecha
        const sortedTasks = uniqueTasks.sort((a, b) => {
          try {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
          } catch (error) {
            console.error("Error al ordenar fechas:", error);
            return 0;
          }
        });

        setConfirmedTasks(sortedTasks);

        // Generar mensaje informativo
        const totalTasks = sortedTasks.length;
        const futureTasks = sortedTasks.filter(task => isTaskSelectable(task.date));
        const pastTasks = totalTasks - futureTasks.length;

        if (totalTasks === 0) {
          setMensaje("No tienes actividades confirmadas");
        } else {
          setMensaje(
            `Encontradas ${totalTasks} actividades confirmadas: ` +
            `${futureTasks.length} futuras, ${pastTasks} pasadas`
          );
        }

      } catch (err) {
        console.error("❌ Error completo:", err);
        
        const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           err.message || 
                           "Error desconocido al cargar actividades";
        
        if (setError) setError(`Error al cargar actividades: ${errorMessage}`);
        setMensaje(`Error: ${errorMessage}`);
        setConfirmedTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchConfirmedTasks();
  }, [setError]);

  const guardarConfiguracion = async () => {
    if (!selectedActivity || !anticipationDays) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    const anticipationValue = parseInt(anticipationDays);
    if (anticipationValue < 1 || anticipationValue > 30) {
      setMensaje("Los días de anticipación deben estar entre 1 y 30.");
      return;
    }

    // Verificar si la actividad seleccionada es del pasado
    const selectedTask = confirmedTasks.find(task => task._id === selectedActivity);
    if (selectedTask && !isTaskSelectable(selectedTask.date)) {
      setMensaje("Advertencia: Esta actividad ya pasó, la notificación no se enviará.");
    }

    try {
      if (saveNotificationConfig) {
        await saveNotificationConfig(selectedActivity, anticipationValue);
        setMensaje("Configuración guardada correctamente.");
        setSelectedActivity("");
        setAnticipationDays("");
      } else {
        throw new Error("saveNotificationConfig no está disponible");
      }
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      setMensaje("Error al guardar configuración: " + (error.message || "Error desconocido"));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "Fecha inválida";
    }
  };

  // Verificar si el contexto está disponible
  if (!useNotifications) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error del Sistema</h2>
            <p className="text-gray-600">El contexto de notificaciones no está disponible.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              🔔 Configurar Notificaciones
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
          </div>
          <p className="text-gray-600 ml-4">Configura recordatorios para tus actividades confirmadas</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">⚠️</span>
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {mensaje && (
          <div className={`mb-6 border rounded-2xl p-4 ${
            mensaje.includes("Error") 
              ? "bg-red-50 border-red-200" 
              : mensaje.includes("No tienes") || mensaje.includes("Advertencia")
              ? "bg-yellow-50 border-yellow-200" 
              : "bg-green-50 border-green-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                mensaje.includes("Error") 
                  ? "bg-red-100" 
                  : mensaje.includes("No tienes") || mensaje.includes("Advertencia")
                  ? "bg-yellow-100" 
                  : "bg-green-100"
              }`}>
                <span className={`text-sm ${
                  mensaje.includes("Error") 
                    ? "text-red-600" 
                    : mensaje.includes("No tienes") || mensaje.includes("Advertencia")
                    ? "text-yellow-600" 
                    : "text-green-600"
                }`}>
                  {mensaje.includes("Error") ? "❌" : 
                   mensaje.includes("No tienes") || mensaje.includes("Advertencia") ? "⚠️" : "✅"}
                </span>
              </div>
              <p className={`${
                mensaje.includes("Error") 
                  ? "text-red-800" 
                  : mensaje.includes("No tienes") || mensaje.includes("Advertencia")
                  ? "text-yellow-800" 
                  : "text-green-800"
              }`}>
                {mensaje}
              </p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notificaciones Activas */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 text-lg">🔔</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Notificaciones Activas</h3>
                  <p className="text-sm text-gray-600">
                    {notifications.length} configuración{notifications.length !== 1 ? 'es' : ''} activa{notifications.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando notificaciones...</p>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">🔕</span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Sin notificaciones</h4>
                  <p className="text-gray-500">No tienes notificaciones configuradas aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((n) => (
                    <div key={n._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-sm">📋</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {n.task?.title || "Sin título"}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <span>📅</span>
                            {formatDate(n.task?.date)}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <span>🔔</span>
                            Notificar {n.daysBefore} día{n.daysBefore !== 1 ? 's' : ''} antes
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nueva Configuración */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-green-600 text-lg">➕</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Nueva Configuración</h3>
                  <p className="text-sm text-gray-600">Agrega un nuevo recordatorio</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loadingTasks ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando actividades...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selector de Actividad */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-blue-600">📋</span>
                      Actividad confirmada
                      <span className="text-xs text-gray-500 font-normal">
                        ({confirmedTasks.length} encontradas)
                      </span>
                    </label>
                    
                    <select
                      value={selectedActivity}
                      onChange={(e) => setSelectedActivity(e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
                    >
                      <option value="">-- Selecciona una actividad --</option>
                      {confirmedTasks.length === 0 ? (
                        <option disabled>No hay actividades disponibles</option>
                      ) : (
                        confirmedTasks.map((task) => {
                          const isSelectable = isTaskSelectable(task.date);
                          
                          return (
                            <option
                              key={task._id}
                              value={task._id}
                              style={{ 
                                color: isSelectable ? 'black' : 'gray',
                                fontStyle: isSelectable ? 'normal' : 'italic'
                              }}
                            >
                              {task.title} - {formatDate(task.date)} 
                              {!isSelectable ? " (Pasada)" : ""}
                            </option>
                          );
                        })
                      )}
                    </select>
                  </div>

                  {/* Días de Anticipación */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-orange-600">⏰</span>
                      Días de anticipación
                      <span className="text-xs text-gray-500 font-normal">(1-30 días)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={anticipationDays}
                      onChange={(e) => setAnticipationDays(e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
                      disabled={!selectedActivity}
                      placeholder="Ej: 3"
                    />
                  </div>

                  {/* Botón de Guardar */}
                  <button
                    onClick={guardarConfiguracion}
                    disabled={!selectedActivity || !anticipationDays || loadingTasks}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loadingTasks ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Cargando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>💾</span>
                        Guardar Configuración
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
