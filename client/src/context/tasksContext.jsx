import { createContext, useContext, useState, useEffect } from "react";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  getTaskRequest,
  updateTaskRequest,
  getOthersTasksRequest,
  togglePromotionRequest,
  getPromotedTasksRequest,
} from "../api/tasks";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [othersTasks, setOthersTasks] = useState([]);
  const [promotedTasks, setPromotedTasks] = useState([]);

  useEffect(() => {
    getTasks();
    getOthersTasks();
    getPromotedTasks();
  }, []);

  const getPromotedTasks = async () => {
    try {
      const res = await getPromotedTasksRequest();
      setPromotedTasks(res.data);
    } catch (error) {
      console.error("Error al obtener promocionadas:", error);
    }
  };

  const togglePromotion = async (id, data) => {
    try {
      const res = await togglePromotionRequest(id, data);
      
      // Actualizar lista principal
      setTasks(prev => prev.map(task => 
        task._id === id ? { ...task, ...res.data } : task
      ));
      
      // Actualizar lista promocionada
      setPromotedTasks(prev => {
        const exists = prev.some(t => t._id === id);
        if (res.data.isPromoted && !exists) return [...prev, res.data];
        if (!res.data.isPromoted) return prev.filter(t => t._id !== id);
        return prev.map(t => t._id === id ? res.data : t);
      });
      
      return res.data;
    } catch (error) {
      console.error("Error al actualizar promoción:", error);
      throw error;
    }
  };

  const getOthersTasks = async () => {
    try {
      const res = await getOthersTasksRequest();
      const currentDate = new Date();
      const filtered = res.data?.filter(task => new Date(task.date) >= currentDate) || [];
      setOthersTasks(filtered);
    } catch (error) {
      console.error("Error al obtener tareas de otros usuarios:", error);
    }
  };

  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      const tasksConPropiedad = res.data.map(task => ({
        ...task,
        isOwner: true,
      }));
      setTasks(tasksConPropiedad);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.status === 204) setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  
     const createTask = async (task) => {
      try {
  
    const formData = new FormData();

    // Agregar campos obligatorios con validación
    if (!task.title || task.title.trim() === '') {
      throw new Error('El título es requerido');
    }
    
    if (!task.date) {
      throw new Error('La fecha es requerida');
    }

    formData.append('title', task.title.trim());
    formData.append('description', task.description || '');
    formData.append('place', task.place || '');
    formData.append('date', task.date);



    // Agregar responsables si existen
    if (task.responsible && Array.isArray(task.responsible)) {
      const cleanResponsible = task.responsible.filter(r => r && r.trim() !== '');
      if (cleanResponsible.length > 0) {
        formData.append('responsible', JSON.stringify(cleanResponsible));
       
      }
    }

    // Agregar imagen si existe
    if (task.image && task.image instanceof File) {
      formData.append('image', task.image);
      console.log('Imagen agregada:', {
        name: task.image.name,
        size: task.image.size,
        type: task.image.type
      });
    }

    // Debug FormData contents
   
    for (let pair of formData.entries()) {
      
    }

    const res = await createTaskRequest(formData);
    const newTaskWithOwner = { ...res.data.task, isOwner: true };

    setTasks(prev => [...prev, newTaskWithOwner]);
    return newTaskWithOwner;
  } catch (error) {
    throw error;
  }
};


  const getTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id, task) => {
    try {
      console.log('Actualizando tarea con datos:', task);
      
      let dataToSend;
      
      // Si hay imagen nueva, crear FormData
      if (task.image && task.image instanceof File) {
        console.log('Preparando FormData para actualización con imagen:', {
          name: task.image.name,
          size: task.image.size,
          type: task.image.type
        });
        
        const formData = new FormData();
        
        // Agregar todos los campos al FormData
        formData.append('title', task.title || '');
        formData.append('description', task.description || '');
        formData.append('place', task.place || '');
        formData.append('date', task.date || '');
        
        // Para el array de responsables
        if (task.responsible && Array.isArray(task.responsible) && task.responsible.length > 0) {
          const cleanResponsible = task.responsible.filter(r => r && r.trim() !== '');
          if (cleanResponsible.length > 0) {
            formData.append('responsible', JSON.stringify(cleanResponsible));
          }
        }
        
        // Agregar la imagen nueva
        formData.append('image', task.image);
        
        dataToSend = formData;
      } else {
        // Si no hay imagen nueva, enviar como objeto normal
        console.log('Actualizando sin imagen nueva');
        dataToSend = {
          ...task,
          responsible: task.responsible && Array.isArray(task.responsible) 
            ? task.responsible.filter(r => r && r.trim() !== '')
            : []
        };
      }
      
      // Realizar la petición
      const res = await updateTaskRequest(id, dataToSend);
      console.log('Respuesta de actualización:', res.data);
      
      // Actualizar la tarea en el estado
      setTasks(prev => prev.map(t => t._id === id ? { ...res.data, isOwner: true } : t));
      
      return res.data;
    } catch (error) {
      console.error('Error detallado al actualizar tarea:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        othersTasks,
        promotedTasks,
        getTasks,
        deleteTask,
        createTask,
        getTask,
        updateTask,
        getOthersTasks,
        togglePromotion,
        getPromotedTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}