// hooks/useAttendance.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAttendance(taskId) {
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail')?.toLowerCase()?.trim();

        const params = { taskId };
        if (userEmail) {
          params.email = userEmail;
        }

      const response = await axios.get('/api/attendances/check', {
  params,
  withCredentials: true
});

        setIsAttending(response.data.isAttending);
      } catch (error) {
        console.error('Error al verificar asistencia:', error);
      }
    };

    if (taskId) {
      fetchAttendance();
    }
  }, [taskId]);

  // Este setter ahora solo actualiza el estado local.
  // La lógica real de confirmación/cancelación debe hacerse desde el componente (vía API).
  const setAttendance = (value) => {
    setIsAttending(value);
  };

  return [isAttending, setAttendance];
}
