import { useState, useEffect } from "react";
import { Button } from "../ui";
import { useNotifications } from "../../context/NotificationsContext";
import { useTasks } from "../../context/tasksContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAsistencia } from "../../context/AsistenciaContext";

export function ConfigurarNotificaciones() {
  const [selectedActivity, setSelectedActivity] = useState("");
  const [anticipationDays, setAnticipationDays] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { attendees } = useAsistencia();

  const { 
    notifications, 
    loading, 
    error, 
    saveNotificationConfig,
    setError 
  } = useNotifications();
  
  const { tasks, othersTasks, getTasks } = useTasks();
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener taskId de los parámetros de URL
  const searchParams = new URLSearchParams(location.search);
  const preselectedTaskId = searchParams.get('taskId');

  useEffect(() => {
    // Cargar las tareas al montar el componente
    if (getTasks) {
      getTasks();
    }
  }, []);

  // Preseleccionar la actividad cuando se carguen las tareas
  useEffect(() => {
    if (preselectedTaskId && (tasks || othersTasks)) {
      // Buscar en ambas listas de tareas
      const allTasks = [...(tasks || []), ...(othersTasks || [])];
      const taskExists = allTasks.find(task => task._id === preselectedTaskId);
      
      if (taskExists) {
        setSelectedActivity(preselectedTaskId);
        setMensaje("Actividad preseleccionada - Configura tus notificaciones");
        setTimeout(() => setMensaje(""), 5000);
      }
    }
  }, [preselectedTaskId, tasks, othersTasks]);

  const guardarConfiguracion = async () => {
    if (!selectedActivity || !anticipationDays) {
      setMensaje("Por favor completa todos los campos.");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    try {
      await saveNotificationConfig(selectedActivity, anticipationDays);
      setMensaje("¡Configuración guardada correctamente!");
      setSelectedActivity("");
      setAnticipationDays("");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      setMensaje("Error al guardar la configuración.");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  // Obtener todas las actividades disponibles (tanto propias como de otros)
 const getConfirmedTasks = () => {
  const currentDate = new Date();
  // Filtrar asistentes por fecha futura y eliminar duplicados por taskId
  const uniqueTaskMap = new Map();

  attendees.forEach((a) => {
    if (!a.task || typeof a.task !== "object") return;

    const taskDate = new Date(a.task.date);
    if (taskDate >= currentDate) {
      uniqueTaskMap.set(a.task._id, a.task);
    }
  });
  return Array.from(uniqueTaskMap.values());
};

  return (

    <div className="bg-white p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#03673E] font-semibold text-lg">
          ⚙️ Notificaciones de Actividades Sociales
        </h2>
        
        {/* Botón para volver */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          ← Volver
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {preselectedTaskId && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">
            ✨ Configura las notificaciones para la actividad que confirmaste
          </p>
        </div>
      )}



      <div className="border-2 rounded-md p-6 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Próximas actividades configuradas */}
        <div>
          <h3 className="text-black font-bold mb-4">Actividades con Notificaciones</h3>
          {loading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : actividadesConfiguradas.length === 0 ? (
            <p className="text-gray-500">No hay actividades configuradas.</p>
          ) : (
            actividadesConfiguradas.map((notification) => (
              <div
                key={notification._id}
                className="bg-[#e5eae6] p-4 rounded mb-3 shadow-sm text-black"
              >
                <p className="font-medium">{notification.task.title}</p>
                <p>Fecha: {new Date(notification.task.date).toLocaleDateString()}</p>
                <p>Lugar: {notification.task.place || 'No especificado'}</p>
                <p className="text-sm text-gray-600">
                  Notificar {notification.daysBefore} días antes
                </p>
              </div>
            ))
          )}
        </div>

        {/* Configuración de notificaciones */}
        <div>
          <h3 className="text-black font-bold mb-4">Configuración de Notificaciones</h3>

          <label className="block mb-2">Seleccionar Actividad</label>
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
            disabled={loading}
          >
        <option value="">Seleccione una actividad</option>
           {getConfirmedTasks().map((task) => (
           <option key={task._id} value={task._id}>
          {task.title} - {new Date(task.date).toLocaleDateString()} - {task.place || 'Sin ubicación'}
         </option>
          ))}

          </select>

          <label className="block mb-2">Tiempo de Anticipación (días):</label>
          <input
            type="number"
            placeholder="Ingrese el número de días"
            value={anticipationDays}
            onChange={(e) => setAnticipationDays(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-600 mb-4 placeholder:text-black"
            disabled={loading}
            min="1"
          />

          <Button
            onClick={guardarConfiguracion}
            className="bg-gradient-to-r from-green-600 to-green-800 text-white px-4 py-2 rounded shadow hover:brightness-110"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Configuración"}
          </Button>

          {mensaje && (
            <p className={`mt-4 font-medium ${
              mensaje.includes("Error") ? "text-red-700" : "text-green-700"
            }`}>
              {mensaje}
            </p>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-gray-50 p-4 rounded border">
        <h4 className="font-semibold text-gray-800 mb-2">ℹ️ Información importante:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Solo se muestran actividades futuras para configurar notificaciones</li>
          <li>• Las notificaciones se enviarán según los días de anticipación configurados</li>
          <li>• Puedes configurar diferentes tiempos para cada actividad</li>
          {preselectedTaskId && (
            <li className="text-blue-600 font-medium">
              • La actividad está preseleccionada porque confirmaste tu asistencia
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}