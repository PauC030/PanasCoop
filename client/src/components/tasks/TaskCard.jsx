import { useEffect, useState } from "react";
import { useTasks } from "../../context/tasksContext";
import { useAsistencia } from "../../context/asistenciaContext";
import deleteImage from '../../assets/eliminarr.png';
import editImage from '../../assets/Editar.png';
import { ButtonIcon } from "../ui/ButtonIcon";
import { ButtonLinkIcon } from "../ui/ButtonLinkIcon";
import { CardActivi } from "../ui/CardActivi";
import { Switch } from '@headlessui/react';
import toast from "react-hot-toast";
import { useAttendance } from "../../hooks/useAttendance"
import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/Button";
import  config  from "../../assets/config.png" 


export function TaskCard({ task, showPromoBadge = false, showAttendanceButton = false, refreshSearch}) {
  const navigate = useNavigate();

  const { togglePromotion, deleteTask } = useTasks();
  const { confirmAttendance, cancelAttendance, fetchAttendees, attendees } = useAsistencia();

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAttendModal, setShowAttendModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
 
  const [email, setEmail] = useState(() => localStorage.getItem("userEmail") || "");
  const [name, setName] = useState(() => localStorage.getItem("userName") || "");

  // Actualizar para usar el hook mejorado
  const [isAttending, setIsAttending, isLoadingAttendance] = useAttendance(task._id);
  const [isLoading, setIsLoading] = useState(false);

   // Nueva función para ir a configuración de notificaciones
  const handleGoToNotifications = () => {
  navigate(`/tasks/notificaciones?taskId=${task._id}`);
};


  useEffect(() => {
    fetchAttendees(task._id);
  }, [task._id]);

  const handleDelete = () => {
    deleteTask(task._id);
    setShowModal(false);
  };

  const handleTogglePromotion = async () => {
    try {
      await togglePromotion(task._id, {
        isPromoted: !task.isPromoted,
        promotion: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
      if (typeof refreshSearch === "function") {
        refreshSearch(); // <-- refresca la búsqueda al instante
      }
    } catch (error) {
      console.error("Error al cambiar promoción:", error);
    }
  };

  const handleConfirmAttend = async () => {
    if (!name?.trim() || !email) {
      toast.error("Completa todos los campos");
      return;
    }
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      // 1. Actualizar estado local primero (optimistic update)
      setIsAttending(true);
      
      // 2. Confirmar en backend
      await confirmAttendance({
        taskId: task._id,
        email: normalizedEmail,
        name: name.trim()
      });

      // 3. Guardar en localStorage
      localStorage.setItem("userEmail", normalizedEmail);
      localStorage.setItem("userName", name.trim());
      
      // 4. Actualizar lista de asistencias del usuario
      const userAttendances = JSON.parse(
        localStorage.getItem(`userAttendances_${normalizedEmail}`) || '[]'
      );
      if (!userAttendances.includes(task._id)) {
        localStorage.setItem(
          `userAttendances_${normalizedEmail}`,
          JSON.stringify([...userAttendances, task._id])
        );
      }
      setShowAttendModal(false);
      toast.success("Asistencia confirmada correctamente!");
    } catch (error) {
      setIsAttending(false); // Revertir si hay error
      toast.error(error.response?.data?.message || "Error al confirmar asistencia");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const userEmail = email.trim().toLowerCase();
      
      // 1. Actualización optimista
      setIsAttending(false);
      
      // 2. Cancelar en el backend
      await cancelAttendance({ 
        taskId: task._id, 
        email: userEmail 
      });
      
      // 3. Actualizar localStorage
      const userAttendances = JSON.parse(
        localStorage.getItem(`userAttendances_${userEmail}`) || '[]'
      );
      const updatedAttendances = userAttendances.filter(id => id !== task._id);
      localStorage.setItem(
        `userAttendances_${userEmail}`,
        JSON.stringify(updatedAttendances)
      );
      
      // 4. Forzar recarga de asistentes
      await fetchAttendees(task._id);
      setShowCancelModal(false);
      toast.success("Asistencia cancelada correctamente ❌");
    } catch (err) {
      console.error("Error al cancelar asistencia:", err);
      setIsAttending(true); // Revertir en caso de error
      toast.error(err.response?.data?.message || "Error al cancelar asistencia");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardActivi className="relative" isPromoted={task.isPromoted || showPromoBadge}>
        {showPromoBadge && (
          <div className="absolute -top-1 -right-1 z-20">
            <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 text-white px-2 py-1 rounded-full shadow-lg">
              <div className="flex items-center gap-1">
                {/* Icono de rayo/promoción */}
                <svg 
                  className="w-2.5 h-2.5 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                
                {/* Texto PROMO más corto */}
                <span className="text-xs font-bold tracking-wide uppercase">
                  PROMO
                </span>
                
                {/* Icono de estrella */}
                <svg 
                  className="w-2.5 h-2.5 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* ICONO CAMPANA POSICIONADO CORRECTAMENTE */}
        {showAttendanceButton && isAttending && (
          <button
            onClick={handleGoToNotifications}
            className={`absolute z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-all duration-200 hover:shadow-lg ${
              showPromoBadge 
                ? 'top-10 right-2' // Si hay promoción, posicionar debajo (más cerca)
                : 'top-0 right-2'  // Si no hay promoción, posicionar arriba
            }`}
            title="Configurar notificación"
          >
            <img src={config} alt="Notificar" className="w-8 h-8" />
          </button>
        )}

        {/* IMAGEN DE LA TAREA SI EXISTE */}
        {task.image && (
          <div className="mb-4">
            <img 
              src={task.image} 
              alt={task.title}
              className="w-full h-48 object-cover rounded-lg shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <header className="relative">
          <div className="flex justify-between items-start gap-2">
            <h1 className={`text-lg font-semibold break-words overflow-hidden text-ellipsis whitespace-nowrap flex-1 ${
              showPromoBadge ? 'pr-16' : '' // Espacio para la etiqueta de promo
            } ${
              showAttendanceButton && isAttending ? 'mr-12' : ''
            }`}>
              {task.title}
            </h1>

            {task.isOwner && (
  <div className="flex items-center gap-2">
    <Switch
      checked={task.isPromoted}
      onChange={handleTogglePromotion}
      className={`${
        task.isPromoted ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gray-300'
      } relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 shadow-md`}
    >
      <span
        className={`${
          task.isPromoted ? 'translate-x-5 bg-white shadow-lg' : 'translate-x-1 bg-white'
        } inline-block h-4 w-4 transform rounded-full transition-transform duration-300`}
      />
    </Switch>
    <span className={`text-sm whitespace-nowrap font-medium ${
      task.isPromoted ? 'text-orange-600' : 'text-gray-600'
    }`}>
      {task.isPromoted ? '⚡ Promocionada' : 'Promocionar'}
    </span>
  </div>
)}
          </div>

          <div className="border-b border-[#c7c0c0] mt-2 mb-4 w-full" />

          {/* LUGAR CON ICONO GPS */}
          {task.place && (
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg 
                className="w-4 h-4 text-green-600 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-gray-700">Lugar:</span>
              <span className="truncate">{task.place}</span>
            </div>
          )}

          {/* RESPONSABLE */}
          {task.responsible?.length > 0 && (
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg 
                className="w-4 h-4 text-blue-600 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="font-semibold text-gray-700">Responsable:</span>
              <span className="truncate">{task.responsible.join(", ")}</span>
            </div>
          )}

          {/* FECHA CON ICONO CALENDARIO */}
          {task.date && (
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg 
                className="w-4 h-4 text-purple-600 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-gray-700">Fecha:</span>
              <span>
                {new Date(task.date).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </header>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
          {/* Botón Ver Detalles con gradiente y icono - MÁS DELGADO */}
          <button
            onClick={() => setShowDetailsModal(true)}
            className="w-full sm:w-auto px-4 py-0.5 bg-gradient-to-r from-[#064349] to-[#03683E] text-white rounded-lg font-medium hover:from-[#075a61] hover:to-[#048447] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <svg 
              className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm sm:text-base">Ver Detalles</span>
          </button>

          {showAttendanceButton && !task.isOwner && (
            <>
              {isLoadingAttendance ? (
                <div className="w-full sm:w-auto px-4 py-0.5 bg-gray-100 text-gray-500 rounded-lg font-medium flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                  <span className="text-sm sm:text-base">Verificando...</span>
                </div>
              ) : !isAttending ? (
                <button
                  onClick={() => setShowAttendModal(true)}
                  className="w-full sm:w-auto px-4 py-0.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <svg 
                    className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Asistir a actividad</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full sm:w-auto px-4 py-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <svg 
                    className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Cancelar Asistencia</span>
                </button>
              )}
            </>
          )}
       
          {task.isOwner && (
            <div className="flex gap-x-2 items-center">
              <button
                onClick={() => navigate(`/tasks/asistencia?taskId=${task._id}`)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-all duration-200"
              > 
                Asistencia
              </button>
              
              <ButtonIcon onClick={() => setShowModal(true)}>
                <img src={deleteImage} alt="Eliminar" className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
              </ButtonIcon>
              <ButtonLinkIcon to={`/tasks/${task._id}`}>
                <img src={editImage} alt="Editar" className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
              </ButtonLinkIcon>
            </div>
          )}
        </div>
      </CardActivi>

    
      {/* Modal de Detalles */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-30">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 break-words whitespace-normal">
              {task.title}
            </h2>

            {/* IMAGEN EN EL MODAL DE DETALLES */}
            {task.image && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={task.image} 
                  alt={task.title}
                  className="max-w-full max-h-64 object-contain rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-semibold">Descripción:</span> {task.description}
              </p>
              
              {/* LUGAR CON ICONO EN MODAL */}
              {task.place && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg 
                    className="w-4 h-4 text-green-600 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Lugar:</span> {task.place}
                </div>
              )}
              
              {/* RESPONSABLE CON ICONO EN MODAL */}
              {task.responsible?.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg 
                    className="w-4 h-4 text-blue-600 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <span className="font-semibold">Responsables:</span> {task.responsible.join(", ")}
                </div>
              )}
              
              {/* FECHA CON ICONO EN MODAL */}
              {task.date && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg 
                    className="w-4 h-4 text-purple-600 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Fecha:</span>{" "}
                  {new Date(task.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-start">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-0.5 text-white font-medium rounded-lg bg-gradient-to-r from-[#064349] to-[#03683E] hover:from-[#075a61] hover:to-[#048447] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmar Asistencia */}
      {showAttendModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Confirmar asistencia</h2>
            <p className="text-gray-600">Completa tus datos para asistir a esta actividad.</p>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nombre"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-4 py-0.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all duration-200"
                onClick={() => setShowAttendModal(false)}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-0.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-medium disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={handleConfirmAttend}
                disabled={isLoading}
              >
                {isLoading ? 'Confirmando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelar Asistencia */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">¿Cancelar asistencia?</h2>
            <p className="text-gray-600">¿Estás seguro de que deseas cancelar tu asistencia a esta actividad?</p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-4 py-0.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all duration-200"
                onClick={() => setShowCancelModal(false)}
                disabled={isLoading}
              >
                No
              </button>
              <button
                className="px-4 py-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-medium disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Eliminar Actividad */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              ¿Estás seguro que deseas eliminar esta actividad?
            </h2>

            <p className="mb-6 text-gray-600 text-center">
              Esta acción eliminará todos los archivos asociados permanentemente.
            </p>

            <div className="border-t border-gray-200 my-4" />

            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 text-gray-700 font-semibold rounded border border-gray-400 hover:bg-gray-100 transition"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 text-white font-semibold rounded bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:opacity-90"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS para las animaciones */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(12deg);
          }
          100% {
            transform: translateX(200%) skewX(12deg);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}