import { useEffect } from "react";
import { useTasks } from "../context/tasksContext";
import { TaskCard } from "../components/tasks/TaskCard";
import { ImFileEmpty } from "react-icons/im";
import { Link, Outlet, useLocation } from "react-router-dom"; // Añadimos useLocation

export function TasksPage() {
  const { tasks, getTasks } = useTasks();
  const location = useLocation(); // Obtenemos la ubicación actual

  useEffect(() => {
    getTasks();
  }, []);

  // Verificamos si estamos en la ruta base (/tasks)
  const isBaseRoute = location.pathname === "/tasks";

  return (
    <div className="flex min-h-screen bg-white-100">
      {/* Sidebar izquierda */}
      <aside className="w-64 bg-[#004D37] text-white p-4 hidden md:block">
        <h1 className="text-xl font-bold mb-6">Actividades solidarias</h1>
        <ul className="space-y-1">
          <li><Link to="buscar" className="block hover:bg-[#003529] p-3 rounded">Buscar y Filtrar Actividad</Link></li>
          <li><Link to="lista" className="block hover:bg-[#003529] p-3 rounded">Lista de Actividades</Link></li>
          <li><Link to="promocionadas" className="block hover:bg-[#003529] p-3 rounded">Actividades Promocionadas</Link></li>
          <li><Link to="notificaciones" className="block hover:bg-[#003529] p-3 rounded">Configurar Notificaciones</Link></li>
          <li><Link to="publicar" className="block hover:bg-[#003529] p-3 rounded">Publicar en Redes Sociales</Link></li>
          <li><Link to="asistencia" className="block hover:bg-[#003529] p-3 rounded">Gestionar Asistencia</Link></li>
        </ul>
      </aside>

      {/* Contenido principal*/}
      <main className="flex-1 p-4"> 
        <Outlet /> {/* Aquí se renderizan los fragmentos */}
        
        {/* Mostramos contenido solo en la ruta base */}
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