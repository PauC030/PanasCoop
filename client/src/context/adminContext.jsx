import { createContext, useContext, useState } from "react";
import { 
  getAdminStatsRequest,
  getAllAdminsRequest,
  createAdminRequest,
  updateAdminRequest,
  deactivateAdminRequest,
  reactivateAdminRequest,
  deleteAdminRequest
} from "../api/admin";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within a AdminProvider");
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const clearErrors = () => setErrors([]);

  const getAdminStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminStatsRequest();
      setStats(res.data);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al obtener estadísticas"]);
    } finally {
      setLoading(false);
    }
  };

  const getAllAdmins = async () => {
    try {
      setLoading(true);
      const res = await getAllAdminsRequest();
      setAdmins(res.data);
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al obtener administradores"]);
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (admin) => {
    try {
      setLoading(true);
      const res = await createAdminRequest(admin);
      setAdmins([res.data.user, ...admins]);
      return res.data;
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al crear administrador"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAdmin = async (id, admin) => {
    try {
      setLoading(true);
      const res = await updateAdminRequest(id, admin);
      setAdmins(admins.map(a => a._id === id ? res.data.admin : a));
      return res.data;
    } catch (error) {
       const errorMessage = error.response?.data?.message || "Error al actualizar administrador";  
          setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);

              // Limpia el error después de 3 segundos
    setTimeout(() => {
      setErrors([]);
    }, 3000);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deactivateAdmin = async (id) => {
    try {
      setLoading(true);
      const res = await deactivateAdminRequest(id);
      setAdmins(admins.map(a => a._id === id ? res.data.admin : a));
      return res.data;
    } catch (error) {
         const errorMessage = error.response?.data?.message || "Error al desactivar administrador";
    setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
      
       // Limpia el error después de 3 segundos
    setTimeout(() => {
      setErrors([]);
    }, 3000);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reactivateAdmin = async (id) => {
    try {
      setLoading(true);
      const res = await reactivateAdminRequest(id);
      setAdmins(admins.map(a => a._id === id ? res.data.admin : a));
      return res.data;
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al reactivar administrador"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (id) => {
    try {
      setLoading(true);
      await deleteAdminRequest(id);
      setAdmins(admins.filter(a => a._id !== id));
    } catch (error) {
      setErrors(error.response?.data?.message || ["Error al eliminar administrador"]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        admins,
        stats,
        errors,
        loading,
        clearErrors,
        getAdminStats,
        getAllAdmins,
        createAdmin,
        updateAdmin,
        deactivateAdmin,
        reactivateAdmin,
        deleteAdmin
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};