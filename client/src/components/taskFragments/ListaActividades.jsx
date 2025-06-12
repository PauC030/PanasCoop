import React from "react";
import { useTasks } from "../../context/tasksContext";
import { TaskCard } from "../tasks/TaskCard";


export function ListaActividades() {
  const { othersTasks } = useTasks();

  if (!othersTasks) return <p className="text-gray-500">Cargando actividades...</p>;

  return (
    <div className="text-black p-4">

      {othersTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {othersTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              showAttendanceButton={true}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No hay actividades disponibles.</p>
      )}
    </div>
  );
}