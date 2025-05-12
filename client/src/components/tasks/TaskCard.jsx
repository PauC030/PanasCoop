import { useState } from "react";
import { useTasks } from "../../context/tasksContext";
import { Button, ButtonLink, Card } from "../ui";
import deleteImage from '../../assets/eliminarr.png';
import editImage from '../../assets/Editar.png';
import { ButtonIcon } from "../ui/ButtonIcon";
import { ButtonLinkIcon } from "../ui/ButtonLinkIcon";
import { CardActivi } from "../ui/CardActivi";

export function TaskCard({ task }) {
  const { deleteTask } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleDelete = () => {
    deleteTask(task._id);
    setShowModal(false);
  };

  return (
    <>
      <CardActivi >
    
        <header >
  <h1 className="text-lg font-semibold break-words overflow-hidden text-ellipsis whitespace-nowrap">{task.title}</h1>
    <div className="border-b border-[#c7c0c0] mt-2 mb-4 w-full"></div>
  {task.place && (
   <p className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
   <span className="font-semibold">Lugar:</span> {task.place}</p>)}

  {task.responsible && task.responsible.length > 0 && (
  <p className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
  <span className="font-semibold ">Responsable:</span>

  {task.responsible.join(", ")}</p>)}
  
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
          <div className="bg-white rounded-lg p-6 max-w-2xl  w-[600px] shadow-xl">
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
                className="px-6 py-2 text-white font-medium rounded transition-all bg-gradient-to-r from-[#064349] to-[#03683E] hover:opacity-90">Volver</button>
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