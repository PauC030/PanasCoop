import { useEffect } from "react";
import { useTasks } from "../context/tasksContext";
import { TaskCard } from "../components/tasks/TaskCard";
import { ImFileEmpty } from "react-icons/im";
import { Link, Outlet, useLocation } from "react-router-dom";

export function TasksPage() {
  const { tasks, getTasks } = useTasks();
  const location = useLocation();

  useEffect(() => {
    getTasks();
  }, []);

  const isBaseRoute = location.pathname === "/tasks";

  return (
    <div className="flex min-h-screen bg-white-100">
      {/* Sidebar izquierda - visible en todos los tamaños */}
      <div className="bg-[#004D37] p-4 max-md:p-3 max-sm:p-2">
        <aside className="w-48 sm:w-60 md:w-64 max-md:w-48 max-sm:w-40 text-white">
          <h1 className="text-base max-md:text-sm max-sm:text-xs font-bold mb-6 max-md:mb-5 max-sm:mb-4">
            Actividades solidarias
          </h1>

          <div className="mb-4 max-md:mb-3 max-sm:mb-2">
            <ul className="space-y-1">
              <li>
                <Link to="buscar" className="block hover:bg-[#003529] p-3 max-md:p-2 max-sm:p-1 rounded text-xs sm:text-sm max-sm:text-[10px]">
                  Buscar y Filtrar Actividad
                </Link>
              </li>
              <li>
                <Link to="lista" className="block hover:bg-[#003529] p-3 max-md:p-2 max-sm:p-1 rounded text-xs sm:text-sm max-sm:text-[10px]">
                  Lista de Actividades
                </Link>
              </li>
              <li>
                <Link to="promocionadas" className="block hover:bg-[#003529] p-3 max-md:p-2 max-sm:p-1 rounded text-xs sm:text-sm max-sm:text-[10px]">
                  Actividades Promocionadas
                </Link>
              </li>
              <li>
                <Link to="notificaciones" className="block hover:bg-[#003529] p-3 max-md:p-2 max-sm:p-1 rounded text-xs sm:text-sm max-sm:text-[10px]">
                  Configurar Notificaciones
                </Link>
              </li>
              <li>
                <Link to="publicar" className="block hover:bg-[#003529] p-3 max-md:p-2 max-sm:p-1 rounded text-xs sm:text-sm max-sm:text-[10px]">
                  Publicar en Redes Sociales
                </Link>
              </li>
              <li>
                <Link to="asistencia" className="block hover:bg-[#003529] p-3 max-md:p-2 max-sm:p-1 rounded text-xs sm:text-sm max-sm:text-[10px]">
                  Gestionar Asistencia
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 p-4">
        <Outlet />

        {isBaseRoute && (
          <>
            {tasks.length === 0 && (
              <div className="flex justify-center items-center p-10">
                <div>
                  <ImFileEmpty className="text-6xl text-gray-400 m-auto my-2" />
                  <h1 className="font-bold text-xl text-gray-400">
                    No hay tareas aún, Porfavor agregue una nueva tarea
                  </h1>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 bg-white text-black">
              {tasks.map((task) => (
                <TaskCard task={task} key={task._id} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}