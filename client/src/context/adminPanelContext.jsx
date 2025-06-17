import { createContext, useContext, useState, useEffect } from "react";
import { 
  getUsersRequest,
  getUserDetailsRequest,
  updateUserRequest,
  toggleUserStatusRequest,
  deleteUserRequest,
  getUserStatsRequest,
  getActivitiesRequest,
  approveActivityRequest,
  rejectActivityRequest,
  toggleActivityPromotionRequest,
  getActivityStatsRequest,
  getAttendancesRequest,
  deleteAttendanceRequest,
  getAttendanceStatsRequest
} from "../api/adminPanel";

const AdminPanelContext = createContext();

export const useAdminPanel = () => {
  const context = useContext(AdminPanelContext);
  if (!context) throw new Error("useAdminPanel must be used within a AdminPanelProvider");
  return context;
};

export const AdminPanelProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [activityStats, setActivityStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const clearErrors = () => setErrors([]);

  // Users
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const res = await getUsersRequest(params);
      setUsers(res.data);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al obtener usuarios"]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (id) => {
    try {
      setLoading(true);
      const res = await getUserDetailsRequest(id);
      return res.data;
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al obtener detalles del usuario"]);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      const res = await updateUserRequest(id, userData);
      setUsers(users.map(u => u._id === id ? res.data.user : u));
      return res.data;
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al actualizar usuario"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, isActive) => {
    try {
      setLoading(true);
      const res = await toggleUserStatusRequest(id, isActive);
      setUsers(users.map(u => u._id === id ? res.data.user : u));
      return res.data;
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al cambiar estado del usuario"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await deleteUserRequest(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al eliminar usuario"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const res = await getUserStatsRequest();
      setUserStats(res.data);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al obtener estadísticas de usuarios"]);
    } finally {
      setLoading(false);
    }
  };

  // Activities
  const fetchActivities = async (params = {}) => {
    try {
      setLoading(true);
      const res = await getActivitiesRequest(params);
      setActivities(res.data);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al obtener actividades"]);
    } finally {
      setLoading(false);
    }
  };

  const approveActivity = async (id) => {
    try {
      setLoading(true);
      const res = await approveActivityRequest(id);
      setActivities(activities.map(a => a._id === id ? res.data.activity : a));
      return res.data;
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al aprobar actividad"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectActivity = async (id, reason) => {
    try {
      setLoading(true);
      const res = await rejectActivityRequest(id, reason);
      setActivities(activities.map(a => a._id === id ? res.data.activity : a));
      return res.data;
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al rechazar actividad"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleActivityPromotion = async (id, promotion) => {
    try {
      setLoading(true);
      const res = await toggleActivityPromotionRequest(id, promotion);
      setActivities(activities.map(a => a._id === id ? res.data.activity : a));
      return res.data;
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al cambiar promoción de actividad"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityStats = async () => {
    try {
      setLoading(true);
      const res = await getActivityStatsRequest();
      setActivityStats(res.data);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al obtener estadísticas de actividades"]);
    } finally {
      setLoading(false);
    }
  };

  // Attendances
  const fetchAttendances = async (params = {}) => {
    try {
      setLoading(true);
      const res = await getAttendancesRequest(params);
      setAttendances(res.data);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al obtener asistencias"]);
    } finally {
      setLoading(false);
    }
  };

  const deleteAttendance = async (id) => {
    try {
      setLoading(true);
      await deleteAttendanceRequest(id);
      setAttendances(attendances.filter(a => a._id !== id));
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al eliminar asistencia"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceStats = async () => {
    try {
      setLoading(true);
      const res = await getAttendanceStatsRequest();
      setAttendanceStats(res.data);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al obtener estadísticas de asistencias"]);
    } finally {
      setLoading(false);
    }
  };

  // Load initial stats
  useEffect(() => {
    fetchUserStats();
    fetchActivityStats();
    fetchAttendanceStats();
  }, []);

  return (
    <AdminPanelContext.Provider
      value={{
        users,
        activities,
        attendances,
       stats: {
        users: userStats,
        activities: activityStats,
        attendances: attendanceStats
      },
        loading,
        errors,
        clearErrors,
        // Users
        fetchUsers,
        fetchUserDetails,
        updateUser,
        toggleUserStatus,
        deleteUser,
        fetchUserStats,
        // Activities
        fetchActivities,
        approveActivity,
        rejectActivity,
        toggleActivityPromotion,
        fetchActivityStats,
        // Attendances
        fetchAttendances,
        deleteAttendance,
        fetchAttendanceStats
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  );
};