// src/components/tasks/TaskCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useTasks } from "../../context/tasksContext";
import deleteImage from '../../assets/eliminarr.png';
import editImage   from '../../assets/Editar.png';
import { ButtonIcon }     from "../ui/ButtonIcon";
import { ButtonLinkIcon } from "../ui/ButtonLinkIcon";
import { CardActivi }     from "../ui/CardActivi";

export function TaskCard({ task, showActions = true }) {
  const { isAuthenticated } = useAuth();
  const { deleteTask }      = useTasks();
  const navigate            = useNavigate();
  const [showModal, setShowModal]             = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleDelete  = () => { deleteTask(task._id); setShowModal(false); };
  const handleEdit    = () => navigate(`/tasks/${task._id}`);
  const handleDetails = () => setShowDetailsModal(true);

  return (
    <>
      <CardActivi>
        <header>
          <h1 className="text-lg font-semibold">{task.title}</h1>
          <div className="border-b my-2"></div>
          {task.place && (
            <p><strong>Lugar:</strong> {task.place}</p>
          )}
          {task.responsible?.length > 0 && (
            <p><strong>Responsable:</strong> {task.responsible.join(", ")}</p>
          )}
          <p>
            <strong>Fecha:</strong>{" "}
            {task.date && new Date(task.date)
              .toLocaleDateString("es-ES", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
          </p>
        </header>

        <div className="mt-4 flex items-center justify-between">
          {/* Siempre visible */}
          <button
            onClick={handleDetails}
            className="px-4 py-1 bg-green-500 text-black rounded"
          >
            Ver Detalles
          </button>

          {/* Solo si está autenticado y showActions===true */}
          { isAuthenticated && showActions && (
            <div className="flex gap-2">
              <ButtonIcon onClick={() => setShowModal(true)}>
                <img src={deleteImage} alt="Eliminar" className="h-6 w-6" />
              </ButtonIcon>
              <ButtonLinkIcon to={`/tasks/${task._id}`}>
                <img src={editImage} alt="Editar" className="h-6 w-6" />
              </ButtonLinkIcon>
            </div>
          )}
        </div>
      </CardActivi>

      {/* Modal de detalles */}
      {showDetailsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
            <p><strong>Descripción:</strong> {task.description}</p>
            {task.place && <p><strong>Lugar:</strong> {task.place}</p>}
            {task.responsible?.length > 0 &&
              <p><strong>Responsables:</strong> {task.responsible.join(", ")}</p>
            }
            <p>
              <strong>Fecha:</strong>{" "}
              {task.date && new Date(task.date)
                .toLocaleDateString("es-ES", {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de borrado */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              ¿Eliminar esta actividad?
            </h2>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
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
