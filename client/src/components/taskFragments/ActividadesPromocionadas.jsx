import { useEffect } from 'react';
import { useTasks } from '../../context/tasksContext';
import { TaskCard } from '../tasks/TaskCard';

export function ActividadesPromocionadas() {
  const { promotedTasks, getPromotedTasks } = useTasks();

  useEffect(() => {
    getPromotedTasks();
  }, []);

  return (
    <div className="text-black p-4">
    

     <h2 className="text-[#03673E] font-semibold text-lg mb-6">
        ⭐ Actividades Promocionadas
      </h2>
     

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotedTasks.length === 0 ? (
          <div className="text-gray-500 italic col-span-full text-center py-6">
            No hay actividades promocionadas en este momento
          </div>
        ) : (
          promotedTasks.map((task) => (
            <TaskCard key={task._id} task={task}  showPromoBadge={true} />
          ))
        )}
      </div>
    </div>
  );
}