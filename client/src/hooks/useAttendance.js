import { useState, useEffect } from 'react';


export const useAttendance = (taskId) => {
  const [attending, setAttending] = useState(() => {
    const userEmail = localStorage.getItem("userEmail")?.trim().toLowerCase();
    if (!userEmail) return false;
    const userAttendances = JSON.parse(localStorage.getItem(`userAttendances_${userEmail}`) || '[]');
    return userAttendances.includes(taskId);
  });

  return [attending, setAttending];
};