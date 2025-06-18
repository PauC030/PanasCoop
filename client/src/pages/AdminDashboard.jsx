import { useEffect, useState } from "react";
import { useAdmin } from "../context/adminContext";
import { useAuth } from "../context/authContext";
import { useAdminPanel } from "../context/adminPanelContext";
import { Navigate } from "react-router-dom";
import AdminStats from "../components/admin/AdminStats";
import AdminList from "../components/admin/AdminList";
import CreateAdminForm from "../components/admin/CreateAdminForm";
import UserStats from "../components/admin/users/UserStats";
import UserTable from "../components/admin/users/UserTable";
import ActivityStats from "../components/admin/activities/ActivityStats";
import ActivityTable from "../components/admin/activities/ActivityTable";
import AttendanceStats from "../components/admin/attendances/AttendanceStats";
import AttendanceTable from "../components/admin/attendances/AttendanceTable";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { 
    admins, 
    stats, 
    loading: adminLoading, 
    errors: adminErrors, 
    getAdminStats, 
    getAllAdmins,
    clearErrors: clearAdminErrors
  } = useAdmin();
  
  const {
    users,
    activities,
    attendances,
    userStats,
    activityStats,
    attendanceStats,
    loading: panelLoading,
    errors: panelErrors,
    clearErrors: clearPanelErrors,
    fetchUsers,
    fetchActivities,
    fetchAttendances,
    fetchUserStats,
    fetchActivityStats,
    fetchAttendanceStats
  } = useAdminPanel();

  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    if (user?.role === "superadmin") {
      getAdminStats();
      getAllAdmins();
    }
    
    if (user?.role === "admin") {
      fetchUsers();
      fetchActivities();
      fetchAttendances();
      fetchUserStats();
      fetchActivityStats();
      fetchAttendanceStats();
    }
  }, [user]);

  if (user?.role !== "superadmin" && user?.role !== "admin") {
    return <Navigate to="/tasks" replace />;
  }

  const loading = adminLoading || panelLoading;
  const errors = [...adminErrors, ...panelErrors];

  const clearErrors = () => {
    clearAdminErrors();
    clearPanelErrors();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === "superadmin" ? "Panel de Super Administración" : "Panel de Administración"}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {user.role === "superadmin" 
              ? "Gestión completa del sistema" 
              : "Gestión de usuarios, actividades y asistencias"}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4 overflow-x-auto pb-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("stats")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "stats"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Estadísticas
            </button>
            
            {user.role === "superadmin" && (
              <>
                <button
                  onClick={() => setActiveTab("admins")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "admins"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Administradores
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "create"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Crear Administrador
                </button>
              </>
            )}


            
        {user.role === "admin" && (
           <>
            <button
              onClick={() => setActiveTab("users")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Usuarios
            </button>
            
            <button
              onClick={() => setActiveTab("activities")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "activities"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Actividades
            </button>
            
            <button
              onClick={() => setActiveTab("attendances")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "attendances"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Asistencias
            </button>
                </>)}
          </nav>
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Se encontraron {errors.length} error(es)</h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={clearErrors}
                  className="text-red-700 hover:text-red-500"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          {loading && activeTab !== "users" && activeTab !== "activities" && activeTab !== "attendances" && (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}
          
          <div className="px-4 py-5 sm:p-6">
           {activeTab === "stats" && (
         <div className="space-y-8">
    {/* Mostrar solo las estadísticas correspondientes a cada rol */}
        {user.role === "superadmin" ? (
         <AdminStats stats={stats} />
        ) : (
        <>
        <UserStats />
        <ActivityStats />
        <AttendanceStats />
      </>
       )}
    </div>
    )}
            
            {activeTab === "admins" && user.role === "superadmin" && <AdminList admins={admins} />}
            {activeTab === "create" && user.role === "superadmin" && <CreateAdminForm />}
            
            {activeTab === "users" && (
              <div className="space-y-6">
                <UserStats />
                <UserTable />
              </div>
            )}
            
            {activeTab === "activities" && (
              <div className="space-y-6">
                <ActivityStats />
                <ActivityTable />
              </div>
            )}
            
            {activeTab === "attendances" && (
              <div className="space-y-6">
                <AttendanceStats />
                <AttendanceTable />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}