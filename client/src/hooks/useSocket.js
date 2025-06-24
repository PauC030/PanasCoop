// hooks/useSocket.js - CORREGIDO SIN DEPENDENCIAS CIRCULARES
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

  // Función para limpiar timeouts - REMOVIDA del useEffect dependencies
  const clearTimeouts = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Función para unirse a la sala - REMOVIDA del useEffect dependencies
  const joinUserRoom = useCallback((socket, userId) => {
    if (!socket || !socket.connected || !userId) return;
    
    console.log('🏠 Intentando unirse a sala:', userId);
    socket.emit('join', userId);
    
    // Reintento después de 2 segundos si no se confirma
    setTimeout(() => {
      if (socket.connected) {
        console.log('🔄 Reintento de unión a sala:', userId);
        socket.emit('join', userId);
      }
    }, 2000);
  }, []);

  // EFECTO PRINCIPAL - Solo depende de isAuthenticated y user
  useEffect(() => {
    console.log('🔄 useSocket Effect ejecutándose...');
    console.log('👤 Usuario autenticado:', isAuthenticated);
    console.log('👤 Usuario:', user);

    // Limpiar timeouts anteriores
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Si no está autenticado o no hay usuario, desconectar
    if (!isAuthenticated || !user) {
      console.log('❌ Usuario no autenticado, desconectando socket...');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      isConnectingRef.current = false;
      return;
    }

    // Evitar múltiples conexiones simultáneas
    if (isConnectingRef.current) {
      console.log('⚠️ Conexión ya en progreso, saltando...');
      return;
    }

    // Si ya hay una conexión activa, verificar y re-unirse
    if (socketRef.current?.connected) {
      console.log('✅ Socket ya conectado, re-uniéndose a sala...');
      const userId = user.id || user._id;
      // Llamar directamente sin usar el callback
      if (socketRef.current && socketRef.current.connected && userId) {
        console.log('🏠 Re-uniéndose a sala:', userId);
        socketRef.current.emit('join', userId);
      }
      return;
    }

    console.log('🔌 Iniciando nueva conexión socket...');
    isConnectingRef.current = true;
    
    // URL del servidor
    const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    console.log('🌐 URL del servidor:', serverUrl);

    // Crear conexión socket con configuración optimizada
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 10,
      query: {
        userId: user.id || user._id
      }
    });

    socketRef.current = socket;

    // Función interna para unirse a sala (evita dependencias circulares)
    const joinRoom = (userId) => {
      if (!socket || !socket.connected || !userId) return;
      console.log('🏠 Intentando unirse a sala:', userId);
      socket.emit('join', userId);
      
      setTimeout(() => {
        if (socket.connected) {
          console.log('🔄 Reintento de unión a sala:', userId);
          socket.emit('join', userId);
        }
      }, 2000);
    };

    // Evento: Conexión exitosa
    socket.on('connect', () => {
      console.log('✅ Socket conectado exitosamente!');
      console.log('🆔 Socket ID:', socket.id);
      isConnectingRef.current = false;
      
      toast.success('Conectado a notificaciones', {
        duration: 2000,
        icon: '🔌'
      });

      // Unirse a la sala del usuario INMEDIATAMENTE
      const userId = user.id || user._id;
      joinRoom(userId);
    });

    // Confirmar que se unió a la sala
    socket.on('joined', (room) => {
      console.log('✅ Unido exitosamente a la sala:', room);
      toast.success(`Conectado a notificaciones personales`, {
        duration: 1500,
        icon: '🏠'
      });
    });

    // Evento: Error al unirse a sala
    socket.on('join_error', (error) => {
      console.error('❌ Error al unirse a sala:', error);
      toast.error('Error al configurar notificaciones');
      
      // Reintentar unirse después de un tiempo
      const userId = user.id || user._id;
      reconnectTimeoutRef.current = setTimeout(() => {
        if (socket.connected) {
          console.log('🔄 Reintentando unirse a sala después de error...');
          joinRoom(userId);
        }
      }, 3000);
    });

    // Escuchar notificaciones - evento principal
    socket.on('nueva_notificacion', (notification) => {
      console.log('🔔 NOTIFICACIÓN RECIBIDA (nueva_notificacion):', notification);
      
      try {
        if (addRealtimeNotification) {
          addRealtimeNotification({
            title: notification.title || 'Nueva notificación',
            message: notification.message || 'Tienes una nueva actividad',
            type: notification.type || 'reminder',
            taskId: notification.taskId,
            timestamp: notification.timestamp || new Date()
          });

          toast.success(notification.message || 'Nueva notificación', {
            duration: 4000,
            icon: '🔔'
          });
        } else {
          console.error('❌ addRealtimeNotification no está disponible');
          toast.success(notification.message || 'Nueva notificación', {
            duration: 4000,
            icon: '🔔'
          });
        }
      } catch (error) {
        console.error('❌ Error procesando notificación:', error);
      }
    });

    // También escuchar 'notification' por compatibilidad
    socket.on('notification', (notification) => {
      console.log('🔔 NOTIFICACIÓN RECIBIDA (notification):', notification);
      
      try {
        if (addRealtimeNotification) {
          addRealtimeNotification({
            title: notification.title || 'Nueva notificación',
            message: notification.message || 'Tienes una nueva actividad',
            type: notification.type || 'reminder',
            taskId: notification.taskId,
            timestamp: notification.timestamp || new Date()
          });
        }

        toast.success(notification.message || 'Nueva notificación', {
          duration: 4000,
          icon: '🔔'
        });
      } catch (error) {
        console.error('❌ Error procesando notificación:', error);
      }
    });

    // Evento de prueba
    socket.on('test_notification', (data) => {
      console.log('🧪 NOTIFICACIÓN DE PRUEBA RECIBIDA:', data);
      toast.success('¡Notificación de prueba recibida!', {
        duration: 3000,
        icon: '🧪'
      });
    });

    // Evento: Desconexión
    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket desconectado. Razón:', reason);
      isConnectingRef.current = false;
      
      if (reason !== 'io client disconnect') {
        toast.error(`Desconectado de notificaciones`, {
          duration: 2000,
          icon: '🔌'
        });
      }
    });

    // Evento: Error de conexión
    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión socket:', error);
      isConnectingRef.current = false;
      toast.error('Error conectando a notificaciones', {
        duration: 2000
      });
    });

    // Evento: Reconexión exitosa
    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconectado después de', attemptNumber, 'intentos');
      toast.success('Reconectado a notificaciones', {
        duration: 2000,
        icon: '🔄'
      });
      
      // Re-unirse a la sala después de reconectar
      const userId = user.id || user._id;
      joinRoom(userId);
    });

    // Evento: Intento de reconexión
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Intento de reconexión #', attemptNumber);
    });

    // Evento: Error de reconexión
    socket.on('reconnect_error', (error) => {
      console.error('❌ Error de reconexión:', error);
    });

    // Evento: Falló la reconexión completamente
    socket.on('reconnect_failed', () => {
      console.error('❌ Falló la reconexión completamente');
      toast.error('No se pudo reconectar a notificaciones', {
        duration: 3000
      });
    });

    // Cleanup al desmontar
    return () => {
      console.log('🧹 Limpiando socket...');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      isConnectingRef.current = false;
      if (socket) {
        socket.off(); // Remover todos los listeners
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user]); // SOLO estas dos dependencias

  // Función para probar notificaciones
  const testNotification = useCallback(() => {
    console.log('🧪 Probando notificación...');
    if (socketRef.current?.connected) {
      const userId = user?.id || user?._id;
      console.log('📤 Enviando test-notification para usuario:', userId);
      
      socketRef.current.emit('test-notification', {
        message: 'Probando notificación desde el frontend',
        userId: userId
      });
      
      toast.success('Solicitud de prueba enviada', {
        duration: 2000,
        icon: '🧪'
      });
    } else {
      console.error('❌ Socket no conectado');
      toast.error('Socket no conectado');
    }
  }, [user]);

  // Función para forzar unión a sala
  const forceJoinRoom = useCallback(() => {
    if (socketRef.current?.connected && user) {
      const userId = user.id || user._id;
      console.log('🔄 Forzando unión a sala:', userId);
      // Llamar directamente sin usar callback
      if (socketRef.current && socketRef.current.connected && userId) {
        socketRef.current.emit('join', userId);
        toast.info('Reintentando conexión a sala...', {
          duration: 1500,
          icon: '🔄'
        });
      }
    } else {
      toast.error('Socket no conectado o usuario no disponible');
    }
  }, [user]);

  // Función para obtener estado del socket
  const getSocketStatus = useCallback(() => {
    if (!socketRef.current) return 'No inicializado';
    if (socketRef.current.connected) return 'Conectado';
    return 'Desconectado';
  }, []);

  // Función para verificar salas
  const getRooms = useCallback(() => {
    if (socketRef.current?.connected) {
      return Array.from(socketRef.current.rooms || []);
    }
    return [];
  }, []);

  return {
    socket: socketRef.current,
    testNotification,
    getSocketStatus,
    getRooms,
    forceJoinRoom,
    isConnected: socketRef.current?.connected || false
  };
};

export default useSocket;