import { createContext, useContext, useState,useEffect } from "react";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  getTaskRequest,
  updateTaskRequest,
  getOthersTasksRequest, //Nuevo import

} from "../api/tasks";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [othersTasks, setOthersTasks] = useState([]); //  Nuevo estado



const getOthersTasks = async () => {
  try {
    const res = await getOthersTasksRequest(); // Llama al API
    setOthersTasks(res.data || []); // Asegura que el estado nunca sea undefined
  } catch (error) {
    console.error("Error al obtener tareas de otros usuarios:", error);
  }
};
useEffect(() => {
  getOthersTasks(); // Llamamos la función cuando se carga la app
}, []);

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
      const res = await createTaskRequest(task);
      setTasks([...tasks, res.data]);
      return res.data;
    } catch (error) {
      console.log(error);
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
      const res = await updateTaskRequest(id, task);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        othersTasks,
        getTasks,
        deleteTask,
        createTask,
        getTask,
        updateTask,
        getOthersTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
