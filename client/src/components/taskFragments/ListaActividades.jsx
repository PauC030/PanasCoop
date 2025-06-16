import React from "react";
import { useTasks } from "../../context/tasksContext";
import { TaskCard } from "../tasks/TaskCard";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ListaActividades() {
  const { othersTasks } = useTasks();
  const navigate = useNavigate();

  if (!othersTasks) return <p className="text-gray-500">Cargando actividades...</p>;

  return (
    <div className="text-black p-4 relative">
    <div className="flex items-center gap-3 mb-6">
  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
    <span className="mr-2">📋</span>
    Lista de Actividades
    <span className="ml-2 text-2xl font-bold text-gray-800">
      ({othersTasks.length})
    </span>
  </h2>
  <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
  <button
    onClick={() => navigate("/tasks/buscar")}
    className="ml-2 p-2 rounded-full hover:bg-gray-200 transition"
    title="Buscar actividad"
  >
    <Search className="w-6 h-6 text-[#03673E]" />
  </button>
</div>


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