import { useEffect, useState  } from "react";
import { useTasks } from "../context/tasksContext";
import { TaskCard } from "../components/tasks/TaskCard";
import { ImFileEmpty } from "react-icons/im";
import { Link, Outlet, useLocation } from "react-router-dom"; // Añadimos useLocation

export function TasksPage() {
  const { tasks, getTasks } = useTasks();
  const location = useLocation(); // Obtenemos la ubicación actual

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
 // #003529//
 return (
  <div className="flex min-h-screen bg-white-100 ">
    {/* Sidebar izquierda - visible en todos los tamaños */}
    <div className="  bg-[#004D37] p-4 max-md:p-3 max-sm:p-2">
    <aside className=" w-36 sm:w-44 md:w-52 max-md:w-36 max-sm:w-32 text-white">



        <h1 className="text-base max-md:text-sm max-sm:text-xs font-bold mb-6 max-md:mb-5 max-sm:mb-4">
          Actividades solidarias
        </h1>

        <div className="mb-4 max-md:mb-3 max-sm:mb-2">
          <ul className="space-y-1">
              <li>
              <Link to="lista" className="block hover:bg-[#003529] p-3 max-md:p-2 max-sm:p-1 rounded text-xs sm:text-sm max-sm:text-[10px]">
                Lista de Actividades
              </Link>
            </li>
            <li>
              <Link to="buscar" className="block hover:bg-[#003529] p-3 max-md:p-2 max-sm:p-1 rounded text-xs sm:text-sm max-sm:text-[10px]">
                Buscar y Filtrar Actividad
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
              <div>
                {/* Sección actividades futuras */}
                {sortedTasks.future.length > 0 && (
                  <div className="mb-64">
                    <div className="text-black y grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {sortedTasks.future.map((task) => (
                        <TaskCard task={task} key={task._id} isPast={false} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Línea separadora */}
                {sortedTasks.future.length > 0 && sortedTasks.past.length > 0 && (
                  <hr className=" text-black border-t-2 border-[#000000] opacity-20 my-8" />
                )}

                {/* Sección actividades pasadas */}
                {sortedTasks.past.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-8 text-gray-500">
                    ⌛ Actividades Pasadas
                    </h2>
                    <div className=" text-black grid md:grid-cols-2 lg:grid-cols-3 gap-2 opacity-80">
                      {sortedTasks.past.map((task) => (
                        <TaskCard task={task} key={task._id}  isPast={true}/>
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