import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;

    // Si se especifican roles permitidos y el usuario no tiene uno de ellos
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/tasks" replace />;
  }
  
  return <Outlet />;
};
