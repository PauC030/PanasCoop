// hooks/useAttendance.js
import { useState, useEffect } from 'react';

export function useAttendance(taskId) {
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    // Cargar estado inicial desde localStorage
    const userEmail = localStorage.getItem('userEmail')?.toLowerCase()?.trim();
    if (userEmail) {
      const userAttendances = JSON.parse(
        localStorage.getItem(`userAttendances_${userEmail}`) || '[]'
      );
      setIsAttending(userAttendances.includes(taskId));
    }
  }, [taskId]);

  const setAttendance = (value) => {
    const userEmail = localStorage.getItem('userEmail')?.toLowerCase()?.trim();
    if (!userEmail) return;

    let attendances = JSON.parse(
      localStorage.getItem(`userAttendances_${userEmail}`) || '[]'
    );

    attendances = value
      ? [...new Set([...attendances, taskId])] // Evita duplicados
      : attendances.filter(id => id !== taskId);

    localStorage.setItem(
      `userAttendances_${userEmail}`,
      JSON.stringify(attendances)
    );
    setIsAttending(value);
  };

  return [isAttending, setAttendance];
}