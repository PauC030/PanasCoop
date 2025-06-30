import React, { createContext, useState, useContext } from 'react';
import {
  confirmAttendanceRequest,
  cancelAttendanceRequest,
  getAttendanceRequest,
  updateAttendanceRequest,
  deleteAttendanceRequest,
  getUserAttendancesRequest
} from '../api/attendanceApi';
 

export const AsistenciaContext = createContext();

export const AsistenciaProvider = ({ children }) => {
  const [attendees, setAttendees] = useState([]);
  const [error, setError] = useState(null);      // Estado para errores
  const [forbidden, setForbidden] = useState(false); // Estado para 403 Forbidden
  const [userAttendances, setUserAttendances] = useState([]);
  const [loadingAttendances, setLoadingAttendances] = useState(false);

 const loadUserAttendances = async () => {
    setLoadingAttendances(true);
    try {
      const res = await getUserAttendancesRequest();
      setUserAttendances(res.data);
    } catch (error) {
      console.error("Error al cargar asistencias del usuario:", error);
    } finally {
      setLoadingAttendances(false);
    }
  };



const fetchAttendees = async (taskId) => {
  try {
    const res = await getAttendanceRequest(taskId);
    setAttendees(res.data); 
  } catch (error) {
    console.error("Error al obtener asistentes:", error);
  }
};


  //  Confirmar asistencia
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


  //  Cancelar asistencia
// Función cancelAttendance corregida en el contexto
const cancelAttendance = async ({ taskId, email }) => {
  setError(null);
  setForbidden(false);
  
  try {
    const lowerEmail = email ? email.trim().toLowerCase() : null;
    
    console.log("🚀 Iniciando cancelación:", { taskId, email: lowerEmail });
    
    // 1. Cancelar en el backend
    const response = await cancelAttendanceRequest({ taskId, email: lowerEmail });
    
    console.log("✅ Respuesta del backend:", response.data);
    
    // 2. Actualizar estado global - MEJORADO
    setAttendees(prev => {
      const filteredAttendees = prev.filter(a => {
        // Filtrar por task y por email/user
        if (a.task !== taskId && a.task?._id !== taskId) return true;
        
        // Si hay email, filtrar por email
        if (lowerEmail && a.email?.toLowerCase() === lowerEmail) return false;
        
        // Si es usuario autenticado, también filtrar por user ID
        if (a.user && response.data.deletedAttendance?.user && 
            a.user.toString() === response.data.deletedAttendance.user.toString()) return false;
            
        return true;
      });
      
      console.log("📊 Asistentes antes:", prev.length, "después:", filteredAttendees.length);
      return filteredAttendees;
    });
    
    // 3. Actualizar userAttendances si es necesario
    if (lowerEmail) {
      setUserAttendances(prev => 
        prev.filter(att => att.task?._id !== taskId && att.task !== taskId)
      );
    }
    
    return response.data; 
    
  } catch (err) {
    console.error("❌ Error en cancelAttendance:", {
      taskId,
      email,
      error: err.response?.data || err.message,
      status: err.response?.status
    });
    
    if (err.response?.status === 403) {
      setForbidden(true);
      const errorMsg = 'No tienes permiso para esta acción';
      setError(errorMsg);
      throw new Error(errorMsg);
    } else if (err.response?.status === 404) {
      const errorMsg = 'Asistencia no encontrada';
      setError(errorMsg);
      throw new Error(errorMsg);
    } else {
      const errorMsg = err.response?.data?.message || 'Error al cancelar asistencia';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }
};


  //  Editar asistencia
const updateAttendance = async (id, updatedData) => {
  setError(null);
  setForbidden(false);
  try {
    const response = await updateAttendanceRequest(id, updatedData);
    // Actualizar ambos estados: attendees global y filteredAttendees local
    setAttendees(prev =>
      prev.map(a => a._id === id ? { ...a, ...response.data.updated } : a)
    );
    return response.data.updated; // Devuelve el asistente actualizado
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


  const createAttendee = async (data) => {
  setError(null);
  setForbidden(false);
  try {
    const response = await confirmAttendanceRequest({
      taskId: data.task,
      name: data.name,
      email: data.email
    });
    
    setAttendees(prev => [...prev, response.data.attendance]);
    return response.data.attendance;
  } catch (error) {
    console.error("Error creating attendee:", error);
    throw error;
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
        userAttendances,
        loadingAttendances,
        loadUserAttendances,
        checkUserAttendance, 
        fetchAttendees,
        confirmAttendance,
        cancelAttendance,
        updateAttendance,
        deleteAttendance,
        createAttendee,
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