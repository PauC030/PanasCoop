import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes";
import { SearchProvider } from "./context/searchContext";
import { BuscarActividad } from "./components/taskFragments/BuscarActividad";
import { ListaActividades } from "./components/taskFragments/ListaActividades";
import { ActividadesPromocionadas } from "./components/taskFragments/ActividadesPromocionadas";
import { ConfigurarNotificaciones } from "./components/taskFragments/ConfigurarNotificaciones";
import { GestionarAsistencia } from "./components/taskFragments/GestionarAsistencia";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import WelcomePage from "./pages/WelcomePage"; 
import { TaskFormPage } from "./pages/TaskFormPage";
import { LoginPage } from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { TaskProvider } from "./context/tasksContext";
import {ResetPasswordPage} from "./pages/ResetPasswordPage";

import { AdminProvider } from "./context/adminContext";
import AdminDashboard from "./pages/AdminDashboard";
import { AsistenciaProvider } from "./context/asistenciaContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { AdminPanelProvider } from "./context/adminPanelContext";
import { Toaster } from 'react-hot-toast';
import React, { Suspense } from 'react';

// Importar useSocket de forma lazy y segura
const useSocket = React.lazy(() => 
  import("./hooks/useSocket")
    .then(module => ({ default: () => { module.default(); return null; } }))
    .catch(error => {
      console.warn('⚠️ useSocket no disponible:', error);
      return { default: () => null };
    })
);

// Componente para manejar el socket de forma segura
function SocketManager() {
  return (
    <Suspense fallback={null}>
      <SocketComponent />
    </Suspense>
  );
}

function SocketComponent() {
  try {
    useSocket();
  } catch (error) {
    console.error('Error en SocketComponent:', error);
  }
  return null;
}

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <NotificationsProvider>
          <AsistenciaProvider>
            <AdminProvider>
              <AdminPanelProvider>
                <SearchProvider>
                  <BrowserRouter>
                    <main className="content-container mx-auto md:px-0">
                      <Navbar />
                      <Toaster position="top-center" reverseOrder={false} />
                      
                      {/* Socket Manager - Con manejo de errores */}
                      <SocketManager />
                      
                      <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        
                        {/* Ruta para verificación de email - NO protegida */}
                        <Route path="/verify-email" element={<VerifyEmailPage />} />
                        <Route path="/verificar-email" element={<EmailVerificationPage />} />
                        {/* Ruta para restablecimiento de contraseña */}
                         <Route path="/reset-password" element={<ResetPasswordPage />} />

                        {/* Rutas protegidas para usuarios autenticados */}
                        <Route element={<ProtectedRoute allowedRoles={["user", "admin", "superadmin"]} />}>
                          <Route path="/welcome" element={<WelcomePage />} />
                          <Route path="/tasks" element={<TasksPage />}>
                            <Route path="buscar" element={<BuscarActividad />} />
                            <Route path="lista" element={<ListaActividades />} />
                            <Route path="promocionadas" element={<ActividadesPromocionadas />} />
                            <Route path="notificaciones" element={<ConfigurarNotificaciones />} />
                            <Route path="asistencia" element={<GestionarAsistencia />} />
                          </Route>
                          <Route path="/add-task" element={<TaskFormPage />} />
                          <Route path="/tasks/:id" element={<TaskFormPage />} />
                          <Route path="/profile" element={<h1>Profile</h1>} />
                        </Route>
                        
                        {/* Rutas protegidas para administradores */}
                        <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
                          <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        </Route>
                      </Routes>
                    </main>
                  </BrowserRouter>
                </SearchProvider>
              </AdminPanelProvider>
            </AdminProvider>
          </AsistenciaProvider>
        </NotificationsProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;