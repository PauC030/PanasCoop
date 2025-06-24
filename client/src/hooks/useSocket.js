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

import { AdminProvider } from "./context/adminContext";
import AdminDashboard from "./pages/AdminDashboard";
import { AsistenciaProvider } from "./context/asistenciaContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { AdminPanelProvider } from "./context/adminPanelContext";
import { Toaster } from 'react-hot-toast';

// React imports
import React, { Suspense, useEffect, useState } from 'react';
import { useAuth } from './context/authContext';

// Importar useSocket directamente
import useSocket from './hooks/useSocket';

// Componente para manejar el socket - TEMPORALMENTE DESHABILITADO
function SocketManager() {
  const { isAuthenticated, user } = useAuth();
  
  // TEMPORALMENTE COMENTADO PARA DEBUG
  // useSocket(); 
  
  console.log('🔌 SocketManager renderizado - Usuario:', isAuthenticated ? 'autenticado' : 'no autenticado');
  
  return null;
}

// Componente de loading simple
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="ml-4">Cargando...</p>
    </div>
  );
}

// Componente de error boundary simple
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error en ErrorBoundary:', error);
    console.error('🚨 Error Info:', errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-red-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Error de Aplicación</h2>
            <p className="text-gray-600 mb-4">Se ha producido un error inesperado</p>
            <div className="text-sm text-gray-500 mb-4">
              <strong>Error:</strong> {this.state.error && this.state.error.toString()}
            </div>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              🔄 Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente de debug para monitorear renders
function DebugRenderCounter() {
  const [renderCount, setRenderCount] = useState(0);
  
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log('🔄 App renderizado', renderCount + 1, 'veces');
  });

  return (
    <div className="fixed top-0 right-0 bg-yellow-200 text-black p-2 text-xs z-50">
      Renders: {renderCount}
    </div>
  );
}

function App() {
  console.log('🚀 App component renderizándose...');
  
  return (
    <ErrorBoundary>
      <div className="app-container">
        <DebugRenderCounter />
        
        <AuthProvider>
          <TaskProvider>
            <NotificationsProvider>
              <AsistenciaProvider>
                <AdminProvider>
                  <AdminPanelProvider>
                    <SearchProvider>
                      <BrowserRouter>
                        <div className="min-h-screen bg-gray-50">
                          <main className="content-container mx-auto md:px-0">
                            <Navbar />
                            
                            <Toaster 
                              position="top-center" 
                              reverseOrder={false}
                              toastOptions={{
                                duration: 3000,
                                style: {
                                  background: '#363636',
                                  color: '#fff',
                                },
                              }}
                            />
                            
                            {/* Socket Manager - TEMPORALMENTE DESHABILITADO */}
                            {/* <SocketManager /> */}
                            
                            <Suspense fallback={<LoadingSpinner />}>
                              <Routes>
                                {/* Rutas públicas */}
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                
                                {/* Ruta para verificación de email - NO protegida */}
                                <Route path="/verify-email" element={<VerifyEmailPage />} />
                                <Route path="/verificar-email" element={<EmailVerificationPage />} />
                                
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
                                
                                {/* Ruta de fallback */}
                                <Route path="*" element={
                                  <div className="flex justify-center items-center min-h-screen">
                                    <div className="text-center">
                                      <h1 className="text-2xl font-bold text-gray-800 mb-4">404 - Página no encontrada</h1>
                                      <p className="text-gray-600">La página que buscas no existe.</p>
                                    </div>
                                  </div>
                                } />
                              </Routes>
                            </Suspense>
                          </main>
                        </div>
                      </BrowserRouter>
                    </SearchProvider>
                  </AdminPanelProvider>
                </AdminProvider>
              </AsistenciaProvider>
            </NotificationsProvider>
          </TaskProvider>
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;