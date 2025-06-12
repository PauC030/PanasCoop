import { useState, useEffect } from 'react';
import { checkAttendanceRequest } from '../api/attendanceApi';

export function useAttendance(taskId) {
  const [isAttending, setIsAttending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAttendanceStatus = async () => {
      if (!taskId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userEmail = localStorage.getItem('userEmail')?.toLowerCase()?.trim();
        
        // Consultar la base de datos en lugar de localStorage
        const response = await checkAttendanceRequest(taskId, userEmail);
        setIsAttending(response.data.isAttending);
        
        // Opcional: Sincronizar localStorage con la BD
        if (userEmail) {
          const userAttendances = JSON.parse(
            localStorage.getItem(`userAttendances_${userEmail}`) || '[]'
          );
          
          if (response.data.isAttending && !userAttendances.includes(taskId)) {
            // Agregar a localStorage si está en BD pero no en local
            localStorage.setItem(
              `userAttendances_${userEmail}`,
              JSON.stringify([...userAttendances, taskId])
            );
          } else if (!response.data.isAttending && userAttendances.includes(taskId)) {
            // Remover de localStorage si no está en BD
            localStorage.setItem(
              `userAttendances_${userEmail}`,
              JSON.stringify(userAttendances.filter(id => id !== taskId))
            );
          }
        }
      } catch (error) {
        console.error('Error verificando asistencia:', error);
        // Fallback a localStorage solo en caso de error
        const userEmail = localStorage.getItem('userEmail')?.toLowerCase()?.trim();
        if (userEmail) {
          const userAttendances = JSON.parse(
            localStorage.getItem(`userAttendances_${userEmail}`) || '[]'
          );
          setIsAttending(userAttendances.includes(taskId));
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAttendanceStatus();
  }, [taskId]);

  const setAttendance = (value) => {
    // Solo actualizar el estado local, la BD se actualiza en las funciones confirm/cancel
    setIsAttending(value);
    
    // Sincronizar localStorage
    const userEmail = localStorage.getItem('userEmail')?.toLowerCase()?.trim();
    if (!userEmail) return;

    let attendances = JSON.parse(
      localStorage.getItem(`userAttendances_${userEmail}`) || '[]'
    );

    attendances = value
      ? [...new Set([...attendances, taskId])]
      : attendances.filter(id => id !== taskId);

    localStorage.setItem(
      `userAttendances_${userEmail}`,
      JSON.stringify(attendances)
    );
  };

  return [isAttending, setAttendance, isLoading];
}