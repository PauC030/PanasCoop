import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/authContext';
import { useNotifications } from '../context/NotificationsContext';
import toast from 'react-hot-toast';

const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const { addRealtimeNotification } = useNotifications();

  const socketRef = useRef(null);
  const isConnectingRef = useRef(false);
  const reconnectTimeoutRef = useRef(null);
  const authRetryRef = useRef(null);
  const heartbeatRef = useRef(null);

  const clearTimeouts = useCallback(() => {
    clearTimeout(reconnectTimeoutRef.current);
    reconnectTimeoutRef.current = null;
    clearTimeout(authRetryRef.current);
    authRetryRef.current = null;
    clearInterval(heartbeatRef.current);
    heartbeatRef.current = null;
  }, []);

  const authenticateUser = useCallback((socket, userId) => {
    if (!socket || !socket.connected || !userId) return;
    socket.emit('auth', userId);
    authRetryRef.current = setTimeout(() => {
      if (socket.connected) {
        socket.emit('auth', userId);
      }
    }, 5000);
  }, []);

  const startHeartbeat = useCallback((socket) => {
    clearInterval(heartbeatRef.current);
    heartbeatRef.current = setInterval(() => {
      if (socket && socket.connected) {
        socket.emit('ping');
      }
    }, 30000);
  }, []);

  useEffect(() => {
    clearTimeouts();

    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      isConnectingRef.current = false;
      return;
    }

    if (isConnectingRef.current) return;

    if (socketRef.current?.connected) {
      authenticateUser(socketRef.current, user.id || user._id);
      return;
    }

    isConnectingRef.current = true;

    const serverUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:4000';
    const userId = user.id || user._id;

    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      forceNew: true,
      query: { userId }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      isConnectingRef.current = false;
      authenticateUser(socket, userId);
      startHeartbeat(socket);
    });

    const handleNotification = (notification) => {
      try {
        const processedNotification = {
          title: notification.title || 'Nueva notificación',
          message: notification.message || 'Tienes una nueva actividad',
          type: notification.type || 'reminder',
          taskId: notification.taskId,
          timestamp: notification.timestamp || new Date(),
          read: false
        };
        if (addRealtimeNotification) {
          addRealtimeNotification(processedNotification);
        }
        toast.success(processedNotification.message, {
          duration: 4000,
          icon: '🔔'
        });
      } catch (error) {
        toast.error('Error procesando notificación');
      }
    };

    socket.on('nueva_notificacion', handleNotification);
    socket.on('notification', handleNotification);
    socket.on('notificacion', handleNotification);

    socket.on('disconnect', () => {
      isConnectingRef.current = false;
      clearTimeouts();
    });

    socket.on('connect_error', () => {
      isConnectingRef.current = false;
    });

    socket.on('reconnect', () => {
      authenticateUser(socket, userId);
      startHeartbeat(socket);
    });

    return () => {
      clearTimeouts();
      isConnectingRef.current = false;
      if (socket) {
        socket.off();
        socket.disconnect();
      }
    };
  }, [
    isAuthenticated,
    user,
    authenticateUser,
    addRealtimeNotification,
    startHeartbeat
  ]);

  const testNotification = useCallback(() => {
    if (!socketRef.current?.connected) return;
    const userId = user?.id || user?._id;
    socketRef.current.emit('test-notification', {
      message: 'Probando notificación desde el frontend',
      userId
    });
  }, [user]);

  const forceJoinRoom = useCallback(() => {
    if (!socketRef.current?.connected || !user) return;
    const userId = user.id || user._id;
    clearTimeouts();
    authenticateUser(socketRef.current, userId);
  }, [user, authenticateUser, clearTimeouts]);

  const getSocketStatus = useCallback(() => {
    if (!socketRef.current) return 'No inicializado';
    return socketRef.current.connected ? 'Conectado' : 'Desconectado';
  }, []);

  const getRooms = useCallback(() => {
    if (socketRef.current?.connected) {
      return Array.from(socketRef.current.rooms || []);
    }
    return [];
  }, []);

  const getDebugInfo = useCallback(() => {
    const basicInfo = {
      socketExists: !!socketRef.current,
      connected: socketRef.current?.connected || false,
      socketId: socketRef.current?.id,
      rooms: getRooms(),
      userId: user?.id || user?._id,
      isAuthenticated,
      userName: user?.username
    };
    return Promise.resolve(basicInfo);
  }, [getRooms, user, isAuthenticated]);

  const pingServer = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('ping');
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve(null);
        }, 5000);
        socketRef.current.once('pong', (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
      });
    } else {
      return Promise.resolve(null);
    }
  }, []);

  return {
    socket: socketRef.current,
    testNotification,
    getSocketStatus,
    getRooms,
    forceJoinRoom,
    getDebugInfo,
    pingServer,
    isConnected: socketRef.current?.connected || false
  };
};

export default useSocket;
