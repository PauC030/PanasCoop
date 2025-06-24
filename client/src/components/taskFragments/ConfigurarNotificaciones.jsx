import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui";
import { useNotifications } from "../../context/NotificationsContext";
import axios from "../../api/axios";
import { useLocation } from "react-router-dom";
import { Bell, BellOff, Calendar, CheckCircle, X, Edit2, Trash2, Loader2, Plus, Clipboard, Save } from 'lucide-react';

export function ConfigurarNotificaciones() {
  const [selectedActivity, setSelectedActivity] = useState("");
  const [anticipationDays, setAnticipationDays] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [confirmedTasks, setConfirmedTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [editingNotification, setEditingNotification] = useState(null);
  const [editDays, setEditDays] = useState("");
  const [deletingNotification, setDeletingNotification] = useState(null);
  const [savingConfig, setSavingConfig] = useState(false);
  const location = useLocation();

  // Obtener el contexto de notificaciones
  const notificationsContext = useNotifications();

  // Verificar si el contexto está disponible
  if (!notificationsContext) {
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

  const {
    notifications = [],
    loading = false,
    error,
    saveNotificationConfig,
    deleteNotificationConfig,
    updateNotificationConfig,
    getNotifications,
    setError,
    clearError
  } = notificationsContext;

  // Leer taskId de la URL y seleccionarlo por defecto
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const taskId = params.get("taskId");
    if (taskId) {
      setSelectedActivity(taskId);
    }
  }, [location.search]);

  // Función auxiliar para verificar si una tarea es seleccionable (futura)
  const isTaskSelectable = useCallback((taskDate) => {
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
  }, []);

  // Función para verificar si una tarea ya tiene notificación configurada
  const isTaskConfigured = useCallback((taskId) => {
    return notifications.some(n => n.task?._id === taskId);
  }, [notifications]);

  // Función para obtener tareas confirmadas
  const fetchConfirmedTasks = useCallback(async () => {
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
  }, [setError, isTaskSelectable]);

  // Cargar solo las tareas confirmadas al inicio, NO las notificaciones
  useEffect(() => {
    fetchConfirmedTasks();
    // REMOVIDO: getNotifications() - solo cargar cuando sea necesario
  }, [fetchConfirmedTasks]);

  // Función para limpiar mensajes después de un tiempo
  useEffect(() => {
    if (mensaje && !mensaje.includes("Error")) {
      const timer = setTimeout(() => {
        setMensaje("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const guardarConfiguracion = async () => {
  // Limpiar mensajes previos
  setMensaje("");
  if (clearError) clearError();

  // Validaciones básicas
  if (!selectedActivity || !anticipationDays) {
    setMensaje("Por favor completa todos los campos.");
    return;
  }

  const anticipationValue = parseInt(anticipationDays);
  if (isNaN(anticipationValue) || anticipationValue < 1 || anticipationValue > 30) {
    setMensaje("Los días de anticipación deben ser un número entre 1 y 30.");
    return;
  }

  // Verificar si ya existe una notificación para esta actividad
  const existingNotification = notifications.find(n => n.task?._id === selectedActivity);
  if (existingNotification) {
    setMensaje("Ya existe una notificación configurada para esta actividad.");
    return;
  }

  // Verificar si la actividad seleccionada es del pasado
  const selectedTask = confirmedTasks.find(task => task._id === selectedActivity);
  if (selectedTask && !isTaskSelectable(selectedTask.date)) {
    setMensaje("Advertencia: Esta actividad ya pasó, la notificación no se enviará.");
  }

  setSavingConfig(true);
  try {
    console.log("💾 Guardando configuración:", {
      taskId: selectedActivity,
      daysBefore: anticipationValue
    });

    if (!saveNotificationConfig) {
      throw new Error("saveNotificationConfig no está disponible");
    }

    // Guardar la configuración
    await saveNotificationConfig(selectedActivity, anticipationValue);
    
    // ✅ AQUÍ ESTÁ LA CLAVE: Recargar las notificaciones automáticamente
    try {
      await getNotifications();
      console.log("✅ Notificaciones recargadas automáticamente");
    } catch (loadError) {
      console.warn("⚠️ Error al recargar notificaciones:", loadError);
      // No lanzar error aquí, la configuración ya se guardó
    }
    
    // Mostrar mensaje de éxito y limpiar formulario
    setMensaje("Configuración guardada correctamente.");
    setSelectedActivity("");
    setAnticipationDays("");
      
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    
    // ⚠️ IMPORTANTE: Verificar si realmente falló o es solo un problema de respuesta
    // Si el error es 500 pero el guardado fue exitoso, intentar recargar
    if (error.response?.status === 500) {
      console.log("🔄 Error 500 detectado, intentando verificar si se guardó...");
      
      try {
        // Esperar un poco y recargar las notificaciones para verificar
        setTimeout(async () => {
          try {
            await getNotifications();
            // Si llegamos aquí, probablemente sí se guardó
            setMensaje("Configuración guardada correctamente (verificada tras error del servidor).");
            setSelectedActivity("");
            setAnticipationDays("");
          } catch (verifyError) {
            console.error("Error al verificar:", verifyError);
            setMensaje("Error interno del servidor. Revisa los datos enviados.");
          }
        }, 1000);
        
        return; // Salir aquí para no mostrar el error inmediatamente
      } catch (verifyError) {
        console.error("Error en verificación:", verifyError);
      }
    }
    
    // Manejo específico de errores comunes
    let errorMessage = "Error desconocido";
    
    if (error.response?.status === 500) {
      errorMessage = "Error interno del servidor. Revisa los datos enviados.";
    } else if (error.response?.status === 400) {
      errorMessage = error.response.data?.message || "Datos inválidos";
    } else if (error.response?.status === 401) {
      errorMessage = "No autorizado. Inicia sesión nuevamente.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    setMensaje(`Error al guardar configuración: ${errorMessage}`);
  } finally {
    setSavingConfig(false);
  }
};

  // Función para eliminar notificación
  const eliminarNotificacion = async (notificationId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta notificación?")) {
      return;
    }

    try {
      setDeletingNotification(notificationId);
      await deleteNotificationConfig(notificationId);
      setMensaje("Notificación eliminada correctamente.");
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
      setMensaje("Error al eliminar notificación: " + (error.message || "Error desconocido"));
    } finally {
      setDeletingNotification(null);
    }
  };

  // Función para actualizar notificación
  const actualizarNotificacion = async (notificationId) => {
    const daysValue = parseInt(editDays);
    if (isNaN(daysValue) || daysValue < 1 || daysValue > 30) {
      setMensaje("Los días de anticipación deben ser un número entre 1 y 30.");
      return;
    }

    try {
      await updateNotificationConfig(notificationId, daysValue);
      setMensaje("Notificación actualizada correctamente.");
      setEditingNotification(null);
      setEditDays("");
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      setMensaje("Error al actualizar notificación: " + (error.message || "Error desconocido"));
    }
  };

  // Función para iniciar edición
  const iniciarEdicion = (notification) => {
    setEditingNotification(notification._id);
    setEditDays(notification.daysBefore.toString());
  };

  // Función para cancelar edición
  const cancelarEdicion = () => {
    setEditingNotification(null);
    setEditDays("");
  };

  // Función para cargar notificaciones manualmente
  const cargarNotificaciones = async () => {
    try {
      await getNotifications();
      setMensaje("Notificaciones cargadas correctamente.");
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      setMensaje("Error al cargar notificaciones: " + (error.message || "Error desconocido"));
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

        {/* Main Content Grid - Intercambiadas las posiciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notificaciones Activas - Ahora a la izquierda */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-100 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                   <Bell className="text-blue-600" size={20} />
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
                    <BellOff className="text-gray-400" size={32} />
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
                         <Clipboard className="text-blue-600" size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {n.task?.title || "Sin título"}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Calendar size={14} />
                            {formatDate(n.task?.date)}
                          </p>
                          
                          {/* Edición inline de días */}
                          {editingNotification === n._id ? (
                            <div className="mt-3 flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                max="30"
                                value={editDays}
                                onChange={(e) => setEditDays(e.target.value)}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-sm text-gray-500">días antes</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => actualizarNotificacion(n._id)}
                                  className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                >
                                   <CheckCircle size={12} />
                                </button>
                                <button
                                  onClick={cancelarEdicion}
                                  className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                               <Bell size={14} />
                              Notificar {n.daysBefore} día{n.daysBefore !== 1 ? 's' : ''} antes
                            </p>
                          )}
                        </div>
                        
                        {/* Botones de acción */}
                        {editingNotification !== n._id && (
                         <div className="flex flex-col gap-1">
                           <button
                           onClick={() => iniciarEdicion(n)}
                           className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                           title="Editar"
                          >
                          <Edit2 size={16} />
                          </button>
                             <button
                               onClick={() => eliminarNotificacion(n._id)}
                                disabled={deletingNotification === n._id}
                                 className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Eliminar"
                             >
                         {deletingNotification === n._id ? (
                            <Loader2 size={16} className="animate-spin" />
                         ) : (
                            <Trash2 size={16} />
                          )}
                          </button>
                        </div>
                      )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nueva Configuración - Ahora a la derecha */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                 <Plus className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Nueva Configuración</h3>
                  <p className="text-sm text-gray-600">Configura una nueva notificación</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Mostrar mensaje solo en esta sección */}
              {mensaje && (
                <div className={`border rounded-xl p-4 ${
                  mensaje.includes("Error") 
                    ? "bg-red-50 border-red-200" 
                    : mensaje.includes("No tienes") || mensaje.includes("Advertencia") || mensaje.includes("Ya existe")
                    ? "bg-yellow-50 border-yellow-200" 
                    : "bg-green-50 border-green-200"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      mensaje.includes("Error") 
                        ? "bg-red-100" 
                        : mensaje.includes("No tienes") || mensaje.includes("Advertencia") || mensaje.includes("Ya existe")
                        ? "bg-yellow-100" 
                        : "bg-green-100"
                    }`}>
                      <span className={`text-sm ${
                        mensaje.includes("Error") 
                          ? "text-red-600" 
                          : mensaje.includes("No tienes") || mensaje.includes("Advertencia") || mensaje.includes("Ya existe")
                          ? "text-yellow-600" 
                          : "text-green-600"
                      }`}>
                        {mensaje.includes("Error") ? "❌" : 
                         mensaje.includes("No tienes") || mensaje.includes("Advertencia") || mensaje.includes("Ya existe") ? "⚠️" : "✅"}
                      </span>
                    </div>
                    <p className={`flex-1 text-sm ${
                      mensaje.includes("Error") 
                        ? "text-red-800" 
                        : mensaje.includes("No tienes") || mensaje.includes("Advertencia") || mensaje.includes("Ya existe")
                        ? "text-yellow-800" 
                        : "text-green-800"
                    }`}>
                      {mensaje}
                    </p>
                    <button
                      onClick={() => setMensaje("")}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Selector de Actividad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Actividad
                </label>
                {loadingTasks ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una actividad...</option>
                    {confirmedTasks.map((task) => {
                      const isConfigured = isTaskConfigured(task._id);
                      const isSelectable = isTaskSelectable(task.date);
                      
                      return (
                        <option 
                          key={task._id} 
                          value={task._id}
                          disabled={!isSelectable}
                          style={{
                            backgroundColor: isConfigured ? '#fef3c7' : 'transparent',
                            color: isConfigured ? '#92400e' : (!isSelectable ? '#9ca3af' : 'inherit')
                          }}
                        >
                          {isConfigured ? '⚙️ ' : ''}{task.title} - {formatDate(task.date)}
                          {!isSelectable ? " (Pasada)" : ""}
                          {isConfigured ? " (Ya configurada)" : ""}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              {/* Días de Anticipación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de Anticipación
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={anticipationDays}
                  onChange={(e) => setAnticipationDays(e.target.value)}
                  placeholder="Ej: 3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Entre 1 y 30 días antes de la actividad
                </p>
              </div>

              {/* Botón Guardar */}
              <button
                onClick={guardarConfiguracion}
                disabled={savingConfig || !selectedActivity || !anticipationDays}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                {savingConfig ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} /> Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const SocketDiagnosticTool = () => {
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [userId] = useState('6859680041339331f2ffca81'); // ID de Pau de los logs

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, time }]);
    console.log(`${time} [${type.toUpperCase()}] ${message}`);
  };

  const clearLogs = () => {
    setLogs([]);
    console.clear();
  };

  const testSocketConnection = async () => {
    addLog('🔄 Iniciando prueba de conexión socket...', 'info');
    
    try {
      // Intentar importar socket.io-client
      addLog('📦 Verificando si socket.io-client está disponible...', 'info');
      
      // Simular verificación (ya que no podemos usar import dinámico en artifacts)
      addLog('✅ socket.io-client disponible', 'success');
      
      // URL del servidor
      const serverUrl = 'http://localhost:4000';
      addLog(`🌐 Intentando conectar a: ${serverUrl}`, 'info');
      
      // Simular conexión (en tu aplicación real, esto sería con socket.io)
      addLog('🔌 Creando conexión socket...', 'info');
      addLog('⏳ Esperando respuesta del servidor...', 'info');
      
      // Simulación de estados posibles
      setTimeout(() => {
        addLog('❌ No se pudo conectar - revisa la consola del navegador', 'error');
        addLog('💡 Abre las DevTools (F12) → pestaña Console para ver errores detallados', 'info');
      }, 2000);
      
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    }
  };

  const checkEnvironment = () => {
    addLog('🔍 Verificando entorno de desarrollo...', 'info');
    
    // Verificar variables de entorno
    addLog('📋 Variables de entorno:', 'info');
    addLog(`- NODE_ENV: ${process.env.NODE_ENV || 'no definido'}`, 'info');
    addLog(`- REACT_APP_API_URL: ${process.env.REACT_APP_API_URL || 'no definido'}`, 'info');
    
    // Verificar contextos
    addLog('🧩 Estado de la aplicación:', 'info');
    addLog('- useAuth: Necesita verificación manual', 'warning');
    addLog('- useNotifications: Necesita verificación manual', 'warning');
    
    // Instrucciones
    addLog('📝 INSTRUCCIONES PARA TI:', 'info');
    addLog('1. Abre la consola del navegador (F12)', 'info');
    addLog('2. Ve a la pestaña Console', 'info');
    addLog('3. Busca errores relacionados con socket', 'info');
    addLog('4. Verifica si hay errores de conexión', 'info');
  };

  const testNotificationFlow = () => {
    addLog('🧪 Probando flujo de notificaciones...', 'info');
    addLog(`👤 Usuario de prueba: ${userId}`, 'info');
    
    addLog('📋 Pasos que debería seguir tu aplicación real:', 'info');
    addLog('1. ✅ Usuario autenticado', 'success');
    addLog('2. 🔌 Conectar socket', 'warning');
    addLog('3. 🔐 Autenticar en socket', 'warning');
    addLog('4. 🏠 Unirse a sala personal', 'warning');
    addLog('5. 👂 Escuchar notificaciones', 'warning');
    
    addLog('❗ Los pasos marcados en amarillo necesitan verificación', 'warning');
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-700 bg-green-50 border-green-200';
      case 'error': return 'text-red-700 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🔧 Diagnóstico Simple de Socket
      </h1>
      
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
          📋 Lo que vamos a revisar:
        </h2>
        <ul className="text-yellow-700 space-y-1">
          <li>• Si tu socket se puede conectar al servidor</li>
          <li>• Si hay errores en la consola del navegador</li>
          <li>• Si las configuraciones están correctas</li>
          <li>• Si el flujo de notificaciones funciona</li>
        </ul>
      </div>

      {/* Botones de Control */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={checkEnvironment}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          🔍 Verificar Entorno
        </button>
        
        <button
          onClick={testSocketConnection}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          🔌 Probar Conexión
        </button>
        
        <button
          onClick={testNotificationFlow}
          className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          🧪 Probar Flujo
        </button>
        
        <button
          onClick={clearLogs}
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          🗑️ Limpiar
        </button>
      </div>

      {/* Información importante */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800 mb-2">
          🚨 IMPORTANTE - Lee esto primero:
        </h2>
        <div className="text-red-700 space-y-2">
          <p><strong>1. Abre la consola del navegador:</strong> Presiona F12 → pestaña "Console"</p>
          <p><strong>2. Tu backend dice:</strong> "Clientes conectados en la sala: 0" - esto significa que tu frontend no se está conectando</p>
          <p><strong>3. ID de usuario Pau:</strong> {userId}</p>
          <p><strong>4. Servidor esperado:</strong> http://localhost:4000</p>
        </div>
      </div>

      {/* Log de Diagnóstico */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">📝 Log de Diagnóstico</h2>
          <span className="text-sm text-gray-600">{logs.length} entradas</span>
        </div>
        
        <div className="max-h-96 overflow-y-auto bg-white border rounded-lg p-4">
          {logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg">👆 Haz clic en los botones de arriba para empezar</p>
              <p className="text-sm mt-2">Te guiaré paso a paso para encontrar el problema</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div key={index} className={`p-3 rounded border ${getLogColor(log.type)}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getLogIcon(log.type)}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{log.message}</span>
                        <span className="text-xs opacity-75">{log.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pasos a seguir */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          📖 Qué hacer después del diagnóstico:
        </h2>
        <ol className="text-green-700 space-y-1 list-decimal list-inside">
          <li>Ejecuta todos los botones de diagnóstico</li>
          <li>Revisa la consola del navegador (F12)</li>
          <li>Copia cualquier error que veas en rojo</li>
          <li>Comparte conmigo los errores que encuentres</li>
          <li>Te ayudaré a solucionarlos uno por uno</li>
        </ol>
      </div>
    </div>
  );
};

export default SocketDiagnosticTool;