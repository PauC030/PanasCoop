
// ConfigurarNotificaciones.jsx - Versión corregida
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
            `✅ Encontradas ${totalTasks} actividades confirmadas: ` +
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
        setMensaje(`❌ Error: ${errorMessage}`);
        setConfirmedTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchConfirmedTasks();
  }, [setError]);

  const guardarConfiguracion = async () => {
    if (!selectedActivity || !anticipationDays) {
      setMensaje("⚠️ Por favor completa todos los campos.");
      return;
    }

    const anticipationValue = parseInt(anticipationDays);
    if (anticipationValue < 1 || anticipationValue > 30) {
      setMensaje("⚠️ Los días de anticipación deben estar entre 1 y 30.");
      return;
    }

    // Verificar si la actividad seleccionada es del pasado
    const selectedTask = confirmedTasks.find(task => task._id === selectedActivity);
    if (selectedTask && !isTaskSelectable(selectedTask.date)) {
      setMensaje("⚠️ Advertencia: Esta actividad ya pasó, la notificación no se enviará.");
    }

    try {
      if (saveNotificationConfig) {
        await saveNotificationConfig(selectedActivity, anticipationValue);
        setMensaje("✅ Configuración guardada correctamente.");
        setSelectedActivity("");
        setAnticipationDays("");
      } else {
        throw new Error("saveNotificationConfig no está disponible");
      }
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      setMensaje("❌ Error al guardar configuración: " + (error.message || "Error desconocido"));
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
      <div className="bg-white p-6 min-h-screen text-gray-800">
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
          <strong>Error:</strong> El contexto de notificaciones no está disponible.
        </div>
      </div>
    );
  }

  console.log("RENDER - confirmedTasks:", confirmedTasks);
  console.log("RENDER - notifications:", notifications);
  console.log("RENDER - mensaje:", mensaje);
  console.log("RENDER - error:", error);

  return (
    <div className="bg-white p-6 min-h-screen text-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          🔔 Configurar Notificaciones
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {mensaje && (
        <div className={`px-4 py-2 rounded mb-4 ${
          mensaje.includes("Error") || mensaje.includes("❌")
            ? "bg-red-100 text-red-800" 
            : mensaje.includes("No tienes") || mensaje.includes("⚠️")
            ? "bg-yellow-100 text-yellow-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded bg-gray-50">
        <div>
          <h3 className="font-bold mb-2">🔔 Notificaciones Activas</h3>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#03673E]"></div>
              <p>Cargando notificaciones...</p>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-gray-600">No tienes notificaciones configuradas.</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className="mb-2 p-3 border rounded bg-white">
                <p className="font-semibold">{n.task?.title || "Sin título"}</p>
                <p>📅 {formatDate(n.task?.date)}</p>
                <p className="text-sm text-gray-600">
                  🔔 Notificar {n.daysBefore} días antes
                </p>
              </div>
            ))
          )}
        </div>

        <div>
          <h3 className="font-bold mb-2">➕ Nueva Configuración</h3>
          
          {loadingTasks ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#03673E]"></div>
              <p>Cargando actividades...</p>
            </div>
          ) : (
            <>
              <label className="block mb-2 font-medium">
                📋 Actividad confirmada ({confirmedTasks.length} encontradas):
              </label>
              
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4 bg-white focus:border-[#03673E] focus:outline-none"
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

              <label className="block mb-2 font-medium">
                ⏰ Días de anticipación (1-30):
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={anticipationDays}
                onChange={(e) => setAnticipationDays(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4 focus:border-[#03673E] focus:outline-none"
                disabled={!selectedActivity}
                placeholder="Ej: 3"
              />

              <Button 
                onClick={guardarConfiguracion}
                disabled={!selectedActivity || !anticipationDays || loadingTasks}
                className="w-full bg-[#03673E] hover:bg-[#024d2e] disabled:bg-gray-400"
              >
                {loadingTasks ? "Cargando..." : "💾 Guardar Configuración"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Panel de debug (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
          <h4 className="font-bold mb-2">Debug Info:</h4>
          <p>Confirmed Tasks: {confirmedTasks.length}</p>
          <p>Notifications: {notifications.length}</p>
          <p>Loading Tasks: {loadingTasks.toString()}</p>
          <p>Loading Notifications: {loading.toString()}</p>
        </div>
      )}
    </div>
  );
}
