import { useEffect, useState } from "react";
import { useAdmin } from "../context/adminContext";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
import AdminStats from "../components/admin/AdminStats";
import AdminList from "../components/admin/AdminList";
import CreateAdminForm from "../components/admin/CreateAdminForm";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { 
    admins, 
    stats, 
    loading, 
    errors, 
    getAdminStats, 
    getAllAdmins 
  } = useAdmin();
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    if (user?.role === "superadmin") {
      getAdminStats();
      getAllAdmins();
    }
  }, [user]);

  if (user?.role !== "superadmin") {
    return <Navigate to="/tasks" replace />;
  }

   return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-lg text-gray-600">
            Gestión completa de administradores y estadísticas del sistema
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
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
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {loading && (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}
          
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
              </div>
            </div>
          )}
          
          <div className="px-4 py-5 sm:p-6">
            {activeTab === "stats" && <AdminStats stats={stats} />}
            {activeTab === "admins" && <AdminList admins={admins} />}
            {activeTab === "create" && <CreateAdminForm />}
          </div>
        </div>
      </div>
    </div>
  );
}