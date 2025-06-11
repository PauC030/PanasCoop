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
  createTaskWithImageRequest // Importar la nueva función
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
        isOwner: true, // Agregar propiedad a tareas propias
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
      let res;
      
      // Si hay imagen, usar FormData
      if (task.image) {
        const formData = new FormData();
        
        // Agregar todos los campos al FormData
        formData.append('title', task.title);
        formData.append('description', task.description || '');
        formData.append('place', task.place || '');
        formData.append('date', task.date || '');
        
        // Para el array de responsables, convertir a JSON string
        if (task.responsible && task.responsible.length > 0) {
          formData.append('responsible', JSON.stringify(task.responsible));
        }
        
        // Agregar la imagen
        formData.append('image', task.image);
        
        res = await createTaskWithImageRequest(formData);
      } else {
        // Si no hay imagen, usar la función original
        res = await createTaskRequest(task);
      }
      
      // Agregar la nueva tarea al estado con la propiedad isOwner
      const newTaskWithOwner = { ...res.data, isOwner: true };
      setTasks([...tasks, newTaskWithOwner]);
      return newTaskWithOwner;
    } catch (error) {
      console.error('Error al crear tarea:', error);
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
      let res;
      
      // Si hay imagen nueva, usar FormData
      if (task.image && typeof task.image === 'object') {
        const formData = new FormData();
        
        // Agregar todos los campos al FormData
        formData.append('title', task.title);
        formData.append('description', task.description || '');
        formData.append('place', task.place || '');
        formData.append('date', task.date || '');
        
        // Para el array de responsables
        if (task.responsible && task.responsible.length > 0) {
          formData.append('responsible', JSON.stringify(task.responsible));
        }
        
        // Agregar la imagen nueva
        formData.append('image', task.image);
        
        // Necesitarías crear una función updateTaskWithImageRequest
        // res = await updateTaskWithImageRequest(id, formData);
        res = await updateTaskRequest(id, formData);
      } else {
        // Si no hay imagen nueva, usar la función original
        res = await updateTaskRequest(id, task);
      }
      
      // Actualizar la tarea en el estado
      setTasks(tasks.map(t => t._id === id ? { ...res.data, isOwner: true } : t));
      return res.data;
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
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