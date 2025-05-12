import { createContext, useContext, useState } from "react";
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

  const getTasks = async () => {
    const res = await getTasksRequest();
    setTasks(res.data);
  };

  const getOthersTasks = async () => {
    try {
      const res = await getOthersTasksRequest(); 
      setOthersTasks(res.data);                  //Actualiza estado
    } catch (error) {
      console.error("Error al obtener tareas de otros usuarios", error);
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
        getTasks,
        deleteTask,
        createTask,
        getTask,
        updateTask,
        othersTasks,      // nuevo 
        getOthersTasks,   // nuevo
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
