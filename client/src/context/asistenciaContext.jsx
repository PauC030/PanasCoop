import React, { createContext, useState } from 'react';
import { useContext } from 'react';

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
  

// En tu función fetchAttendees
const fetchAttendees = async (taskId) => {
  try {
    const response = await getAttendanceRequest(taskId);
    // Normaliza los emails para comparación
    const normalizedAttendees = response.data.map(a => ({
      ...a,
      email: a.email.trim().toLowerCase()
    }));
    setAttendees(normalizedAttendees);
  } catch (error) {
    console.error('Error al cargar asistentes:', error);
  }
};

// En tu función confirmAttendance
const confirmAttendance = async (attendanceData) => {
  try {
    const normalizedData = {
      ...attendanceData,
      email: attendanceData.email.trim().toLowerCase()
    };
    
    const response = await confirmAttendanceRequest(normalizedData);
    
    // Actualización optimista del estado
    setAttendees(prev => {
      const exists = prev.some(a => 
        a.taskId === normalizedData.taskId && 
        a.email === normalizedData.email
      );
      return exists ? prev : [...prev, response.data];
    });
    
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

  // Cancelar asistencia y actualizar el estado
 const cancelAttendance = async ({ taskId, email }) => {
  try {
    await cancelAttendanceRequest({ taskId, email });
    setAttendees(prev =>
      prev.filter(a => a.email.trim().toLowerCase() !== email.trim().toLowerCase())
    );
  } catch (error) {
    console.error('Error al cancelar asistencia:', error);
  }
};


  // Actualizar datos de un asistente
  const updateAttendance = async (id, updatedData) => {
    try {
      const response = await updateAttendanceRequest(id, updatedData);
      setAttendees(prev => prev.map(a => a._id === id ? response.data.updated : a));
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
      throw error;
    }
  };

  // Eliminar un asistente por ID
  const deleteAttendance = async (id) => {
    try {
      await deleteAttendanceRequest(id);
      setAttendees(prev => prev.filter(a => a._id !== id));
    } catch (error) {
      console.error('Error al eliminar asistencia:', error);
    }
  };

  return (
    <AsistenciaContext.Provider value={{
      attendees,
      fetchAttendees,
      confirmAttendance,
      cancelAttendance,
      updateAttendance,
      deleteAttendance,
    }}>
      {children}
    </AsistenciaContext.Provider>
  );
};

export function useAsistencia() {
  const context = useContext(AsistenciaContext);
  if (!context) {
    throw new Error("useAsistencia debe usarse dentro de un AsistenciaProvider");
  }
  return context;
}