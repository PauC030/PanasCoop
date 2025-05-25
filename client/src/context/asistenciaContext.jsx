import React, { createContext, useState, useContext } from 'react';
import {
  confirmAttendanceRequest,
  cancelAttendanceRequest,
  getAttendanceRequest,
  updateAttendanceRequest,
  deleteAttendanceRequest,
} from '../api/attendanceApi';

export const AsistenciaContext = createContext();

export const AsistenciaProvider = ({ children }) => {
  const [attendees, setAttendees] = useState([]);
  const [error, setError] = useState(null);      // Estado para errores
  const [forbidden, setForbidden] = useState(false); // Estado para 403 Forbidden
  

  // 🔄 Cargar asistentes de una tarea
 
const fetchAttendees = async (taskId) => {
  try {
    const res = await getAttendanceRequest(taskId);
    setAttendees(res.data); // asegúrate que esto esté actualizando correctamente
  } catch (error) {
    console.error("Error al obtener asistentes:", error);
  }
};


  // ✅ Confirmar asistencia
const confirmAttendance = async (data) => {

  setError(null);
  setForbidden(false);
  
  try {
    // Validación básica
    if (!data?.taskId || !data?.email || !data?.name) {
      throw new Error("Datos incompletos para confirmar asistencia");
    }

    console.log("Enviando a backend:", data); // Debug

    const response = await confirmAttendanceRequest(data);
    
    // Adaptación clave: Normaliza la respuesta del backend
    const normalizedData = {
      ...response.data.attendance,  // Accede al objeto attendance
      taskId: response.data.attendance.task, // Asegura taskId
      email: response.data.attendance.email.toLowerCase()
    };

    // Actualiza el estado global
    setAttendees(prev => [
      ...prev.filter(a => 
        !(a.task === normalizedData.task && a.email === normalizedData.email)
      ),
      normalizedData
    ]);

    return normalizedData;
  } catch (error) {
    console.error("Error en confirmAttendance:", {
      inputData: data,
      error: error.response?.data || error.message
    });
    throw error;
  }
};  


  // ❌ Cancelar asistencia
 const cancelAttendance = async ({ taskId, email }) => {
  setError(null);
  setForbidden(false);
  try {
    const lowerEmail = email.trim().toLowerCase();
    
    // 1. Cancelar en el servidor
    await cancelAttendanceRequest({ taskId, email: lowerEmail });
    
    // 2. Actualizar estado global
    setAttendees(prev => prev.filter(a => a.email !== lowerEmail || a.task !== taskId));
    
    // 3. Actualizar localStorage
    const userAttendances = JSON.parse(localStorage.getItem(`userAttendances_${lowerEmail}`) || '[]');
    const updatedAttendances = userAttendances.filter(id => id !== taskId);
    localStorage.setItem(
      `userAttendances_${lowerEmail}`,
      JSON.stringify(updatedAttendances)
    );
    
    // 4. Actualizar estado local si es necesario
    setUserAttendances(prev => ({
      ...prev,
      [lowerEmail]: updatedAttendances
    }));
    
    toast.success('Asistencia cancelada correctamente');
  } catch (err) {
    if (err.response?.status === 403) {
      setForbidden(true);
      toast.error('No tienes permiso para esta acción');
    } else {
      setError('Error al cancelar asistencia');
      toast.error('Error al cancelar asistencia');
    }
    console.error(err);
  }
};

  // ✏️ Editar asistencia
  const updateAttendance = async (id, updatedData) => {
    setError(null);
    setForbidden(false);
    try {
      const response = await updateAttendanceRequest(id, updatedData);
      setAttendees(prev =>
        prev.map(a => a._id === id ? response.data.updated : a)
      );
    } catch (err) {
      if (err.response?.status === 403) {
        setForbidden(true);
      } else {
        setError('Error al actualizar asistencia');
      }
      console.error(err);
      throw err;
    }
  };

  // 🗑 Eliminar asistencia
  const deleteAttendance = async (id) => {
    setError(null);
    setForbidden(false);
    try {
      await deleteAttendanceRequest(id);
      setAttendees(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      if (err.response?.status === 403) {
        setForbidden(true);
      } else {
        setError('Error al eliminar asistencia');
      }
      console.error(err);
    }
  };

  

  const checkUserAttendance = (taskId) => {
  const userEmail = localStorage.getItem("userEmail")?.trim().toLowerCase();
  if (!userEmail) return false;
  
  // Primero verificar en el estado local
  const localAttendances = JSON.parse(localStorage.getItem(`userAttendances_${userEmail}`) || []);
  if (localAttendances.includes(taskId)) return true;
  
  // Luego verificar en el estado global
  return attendees.some(
    a => a.task === taskId && a.email === userEmail
  );
};

  return (
    <AsistenciaContext.Provider
      value={{
        attendees,
        error,
        forbidden,
        checkUserAttendance, // Nueva función
        fetchAttendees,
        confirmAttendance,
        cancelAttendance,
        updateAttendance,
        deleteAttendance,
      }}
    >
      {children}
    </AsistenciaContext.Provider>
  );
};

// 📦 Custom hook
export function useAsistencia() {
  const context = useContext(AsistenciaContext);
  if (!context) {
    throw new Error("useAsistencia debe usarse dentro de un AsistenciaProvider");
  }
  return context;
}
