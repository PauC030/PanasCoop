import { useEffect } from 'react';
import { useTasks } from '../../context/tasksContext';
import { TaskCard } from '../tasks/TaskCard';

export function ActividadesPromocionadas() {
  const { promotedTasks, getPromotedTasks } = useTasks();

  useEffect(() => {
    getPromotedTasks();
  }, []);

   const currentUserEmail = localStorage.getItem("userEmail");
  
  console.log('Promoted tasks:', promotedTasks);
  console.log('Current user email:', currentUserEmail);
  
 
  if (promotedTasks.length > 0) {
    console.log('First task user object:', promotedTasks[0].user);
    console.log('User object keys:', Object.keys(promotedTasks[0].user || {}));
  }
  
  // Separar las actividades en propias y de otros
  // Método 1: Usando isOwner
  const myPromotedTasks = promotedTasks.filter(task => {
    console.log(`Task ${task.title}: user.email = ${task.user?.email}, user.id = ${task.user?._id}`);
    return task.isOwner === true;
  });
  
  // Método 2: Si isOwner no funciona, usar comparación por email o ID
  const myPromotedTasksAlt = promotedTasks.filter(task => {
        return task.user?.email === currentUserEmail || 
           task.user?.correo === currentUserEmail ||
           task.createdBy === currentUserEmail ||
           task.userEmail === currentUserEmail;
  });

  const othersPromotedTasks = promotedTasks.filter(task => {
    return task.isOwner === false || task.isOwner === undefined;
  });
  
   const finalMyTasks = myPromotedTasks.length > 0 ? myPromotedTasks : myPromotedTasksAlt;
  const finalOthersTasks = finalMyTasks.length > 0 
    ? promotedTasks.filter(task => !finalMyTasks.includes(task))
    : othersPromotedTasks;

  return (
    <div className="text-black p-4">
    {/* Sección: Actividades Promocionadas de Otros - ARRIBA */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800 mr-3">
            ⭐ Actividades Promocionadas ({finalOthersTasks.length})
          </h2>
          <div className="flex-grow h-px bg-gradient-to-r from-green-200 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {finalOthersTasks.length === 0 ? (
            <div className="text-gray-500 italic col-span-full text-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⭐
                    
                  </span>
                </div>
                <p className="text-lg">No hay actividades promocionadas disponibles</p>
                <p className="text-sm text-gray-400">Las actividades promocionadas de otros usuarios aparecerán aquí</p>
              </div>
            </div>
          ) : (
            finalOthersTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                showPromoBadge={true}
                showAttendanceButton={true} // Con botones de asistencia para actividades de otros
              />
            ))
          )}
        </div>
      </div>

      {/* Sección: Mis Actividades Promocionadas - ABAJO */}
      {finalMyTasks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-800 mr-3">
              ⭐ Mis Actividades Promocionadas ({finalMyTasks.length})
            </h2>
            <div className="flex-grow h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finalMyTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                showPromoBadge={true}
                showAttendanceButton={false} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}