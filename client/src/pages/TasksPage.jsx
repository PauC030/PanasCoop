import { useEffect, useState  } from "react";
import { useTasks } from "../context/tasksContext";
import { TaskCard } from "../components/tasks/TaskCard";
import { ImFileEmpty } from "react-icons/im";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ButtonLink } from "../components/ui/ButtonLink";

export function TasksPage() {
  const { tasks, getTasks } = useTasks();
  const location = useLocation();
  const { user } = useAuth();

  const [sortedTasks, setSortedTasks] = useState({
    future: [],                                         
    past: []
  });

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const now = new Date();
    
    const future = tasks
      .filter(task => new Date(task.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
                                                                   
    const past = tasks
      .filter(task => new Date(task.date) < now)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setSortedTasks({ future, past });
  }, [tasks]);

  // Verificamos si estamos en la ruta base (/tasks)
  const isBaseRoute = location.pathname === "/tasks";

  return (
    <div className="flex min-h-screen bg-white-100 mt-16">
      {/* Sidebar izquierda - visible en todos los tamaños */}
      <div className="mt-16 fixed top-0 left-0 h-screen w-fit z-50 bg-gradient-to-b from-[#002615] to-[#056e51] p-4 max-md:p-3 max-sm:p-2">
        <aside className="w-28 sm:w-32 md:w-36 max-md:w-28 max-sm:w-24 text-white">
          <h1 className="text-sm max-md:text-xs max-sm:text-[10px] font-bold mb-6 max-md:mb-5 max-sm:mb-4">
            Actividades solidarias
          </h1>

          <div className="mb-4 max-md:mb-3 max-sm:mb-2">
            <ul className="space-y-1">
              <li>
                <Link to="lista" className="block hover:bg-[#276146] p-2 max-md:p-1 max-sm:p-1 rounded text-[11px] sm:text-xs max-sm:text-[9px]">
                  Lista de Actividades
                </Link>
              </li>
              <li>
                <Link to="buscar" className="block hover:bg-[#276146] p-2 max-md:p-1 max-sm:p-1 rounded text-[11px] sm:text-xs max-sm:text-[9px] whitespace-nowrap">
                  Buscar y Filtrar Actividad
                </Link>
              </li>
              <li>
                <Link to="promocionadas" className="block hover:bg-[#276146] p-2 max-md:p-1 max-sm:p-1 rounded text-[11px] sm:text-xs max-sm:text-[9px] whitespace-nowrap">
                  Promocionadas
                </Link>
              </li>
              <li>
                <Link to="notificaciones" className="block hover:bg-[#276146] p-2 max-md:p-1 max-sm:p-1 rounded text-[11px] sm:text-xs max-sm:text-[9px] whitespace-nowrap">
                  Configurar Notificaciones
                </Link>
              </li>
              <li>
                <Link to="asistencia" className="block hover:bg-[#276146] p-2 max-md:p-1 max-sm:p-1 rounded text-[11px] sm:text-xs max-sm:text-[9px]">
                  Gestionar Asistencia
                </Link>
              </li>
            </ul>

            {/* Panel de administración (solo para superadmin) */}
            {user?.role === "superadmin" && (
              <div className="mb-4 border-t border-[#003529] pt-4">
                <h2 className="text-xs font-bold mb-2 text-white opacity-80">Administración</h2>
                <ButtonLink
                  to="/admin-dashboard"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-[10px] sm:text-xs max-sm:text-[9px] flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg> Panel Admin
                </ButtonLink>
              </div>
            )}
          </div>
        </aside>
      </div>

      <main className="flex-1 p-4 ml-28 sm:ml-32 md:ml-36 max-md:ml-28 max-sm:ml-24 mr-4">
        <Outlet />
        
        {isBaseRoute && (
          <>
            {tasks.length === 0 ? (
              <div className="flex justify-center items-center p-10">
                <div>
                  <ImFileEmpty className="text-6xl text-gray-400 m-auto my-2" />
                  <h1 className="font-bold text-xl text-gray-400">
                    No hay tareas aún, Porfavor agregue una nueva tarea
                  </h1>
                </div>
              </div>
            ) : (                                                             
              <div className="text-black p-4 relative">

                {/* Sección actividades futuras */}
                {sortedTasks.future.length > 0 && (
                  <div className="mb-12">
                    {/* Header opcional para actividades futuras */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        Mis Actividades 
                        <span className="ml-2 text-2xl font-bold text-gray-800">
                          ({sortedTasks.future.length})
                        </span>
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedTasks.future.map((task) => (
                        <TaskCard task={task} key={task._id} isPast={false} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Línea separadora mejorada */}
                {sortedTasks.future.length > 0 && sortedTasks.past.length > 0 && (
                  <div className="relative my-8">
                    <hr className="border-t-2 border-gray-300 opacity-50" />
                    <div className="absolute inset-0 flex justify-center items-center">
                      <span className="bg-white px-4 text-gray-500 font-medium">
                        ⏳ Historial
                      </span>
                    </div>
                  </div>
                )}

                {/* Sección actividades pasadas */}
                {sortedTasks.past.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full"></div>
                      <h2 className="text-xl font-semibold text-gray-500 flex items-center">
                        <span className="mr-2">⌛</span>
                        Actividades Pasadas
                        <span className="ml-2 text-xl font-semibold text-gray-500">
                          ({sortedTasks.past.length})
                        </span>
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedTasks.past.map((task) => (
                        <TaskCard task={task} key={task._id} isPast={true}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}