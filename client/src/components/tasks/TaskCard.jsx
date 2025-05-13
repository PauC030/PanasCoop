import { useState } from "react";
import { useTasks } from "../../context/tasksContext";
import { ButtonLink } from "../ui";
import deleteImage from '../../assets/eliminarr.png';
import editImage from '../../assets/Editar.png';
import { ButtonIcon } from "../ui/ButtonIcon";
import { ButtonLinkIcon } from "../ui/ButtonLinkIcon";
import { CardActivi } from "../ui/CardActivi";
import { Switch } from '@headlessui/react';



export function TaskCard({ task, showPromoBadge = false }) {
  const { togglePromotion, deleteTask } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleDelete = () => {
    deleteTask(task._id);
    setShowModal(false);
  };

  return (
    <>
   <CardActivi className="relative">
    
{showPromoBadge && (
  <div className="absolute -top-1 -right-[1px] bg-[#EAB308] text-white px-3 py-1 text-xs font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.2)] z-20 flex items-center gap-1 rounded-bl-xl border-2 border-[#EAB308]/80">
    <span className="text-[0.75rem] tracking-wide">Promocionada</span>
    <span className="text-[0.65rem] leading-none">⭐</span>
    <div className="absolute -right-[9px] top-0 w-0 h-0 
      border-t-[12px] border-t-transparent
      border-l-[10px] border-l-[#EAB308]
      border-b-[12px] border-b-transparent"></div>
  </div>
)}
        <header className="relative">
          {/* Encabezado con título y switch */}
          <div className="flex justify-between items-start gap-2">
            <h1 className="text-lg font-semibold break-words overflow-hidden  text-ellipsis whitespace-nowrap flex-1">
              {task.title}
            </h1>
            
            {task.isOwner && (
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={task.isPromoted}
                  onChange={async () => {
                    try {
                      await togglePromotion(task._id, { 
                        isPromoted: !task.isPromoted,
                        promotion: {
                          startDate: new Date().toISOString(),
                          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                        }
                      });
                    } catch (error) {
                      console.error("Error al cambiar promoción:", error);
                    }
                  }}
                  className={`${
                    task.isPromoted ? 'bg-green-500' : 'bg-gray-300'
                  } relative inline-flex h-4 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${
                      task.isPromoted ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {task.isPromoted ? 'Promocionada' : 'Promocionar'}
                </span>
              </div>
            )}
          </div>

          <div className="border-b border-[#c7c0c0] mt-2 mb-4 w-full"></div>

          {/* Detalles principales */}
          {task.place && (
            <p className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="font-semibold">Lugar:</span> {task.place}
            </p>
          )}

          {task.responsible && task.responsible.length > 0 && (
            <p className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="font-semibold">Responsable:</span>{" "}
              {task.responsible.join(", ")}
            </p>
          )}
          
          <p className="text-gray-500">
            <span className="font-semibold">Fecha:</span>{" "}
            {task.date &&
              new Date(task.date).toLocaleDateString("es-ES", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
          </p>
        </header>

        {/* Botones inferiores */}
        <div className="mt-6 flex justify-between items-center w-full">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="px-6 py-1 bg-[#22C55E] text-white rounded hover:bg-green-600 transition-colors"
          >
            Ver Detalles
          </button>

          {task.isOwner && (
            <div className="flex gap-x-1 items-center ml-4">
              <ButtonIcon onClick={() => setShowModal(true)}>
                <img src={deleteImage} alt="Eliminar" className="h-6 w-6 hover:scale-110" />
              </ButtonIcon>
              <ButtonLinkIcon to={`/tasks/${task._id}`}>
                <img src={editImage} alt="Editar" className="h-6 w-6 hover:scale-110" />
              </ButtonLinkIcon>
            </div>
          )}
        </div>
      </CardActivi>

      {/* Modal de Detalles */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-30">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-[600px] shadow-xl">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 break-words whitespace-normal">
              {task.title}
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-semibold">Descripción:</span> {task.description}
              </p>
              
              {task.place && (
                <p className="text-gray-600">
                  <span className="font-semibold">Lugar:</span> {task.place}
                </p>
              )}

              {task.responsible && task.responsible.length > 0 && (
                <p className="text-gray-600">
                  <span className="font-semibold">Responsables:</span> {task.responsible.join(", ")}
                </p>
              )}

              <p className="text-gray-600">
                <span className="font-semibold">Fecha:</span>{" "}
                {task.date &&
                  new Date(task.date).toLocaleDateString("es-ES", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </p>
            </div>

            <div className="mt-4 flex justify-start">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 text-white font-medium rounded transition-all bg-gradient-to-r from-[#064349] to-[#03683E] hover:opacity-90"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              ¿Estás seguro que deseas eliminar esta actividad?
            </h2>
            
            <p className="mb-6 text-gray-600 text-center">
              Si elimina esta actividad se borrarán todos los archivos asociados permanentemente
            </p>
            
            <div className="border-t border-gray-200 my-4"></div>
            
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded"
                onClick={handleDelete}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}