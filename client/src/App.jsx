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
import { TaskFormPage } from "./pages/TaskFormPage";
import { LoginPage } from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { TaskProvider } from "./context/tasksContext";


import { AdminProvider } from "./context/adminContext";
import AdminDashboard from "./pages/AdminDashboard";

import { AsistenciaProvider } from "./context/asistenciaContext"; // importa tu nuevo provider
import { NotificationsProvider } from "./context/NotificationsContext"; // Ajusta según tu estructura


import { Toaster } from 'react-hot-toast';

function App() {
  return (
     
    <AuthProvider>

      <TaskProvider>
        <NotificationsProvider>
        <AsistenciaProvider> 
          <AdminProvider>
            <SearchProvider>
              <BrowserRouter>
                <main className="content-container mx-auto md:px-0">
                  <Navbar />
                  <Toaster position="top-center" reverseOrder={false} />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route element={<ProtectedRoute allowedRoles={["user", "admin", "superadmin"]} />}>
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
                <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
             </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </SearchProvider>

      </AdminProvider>


    </AsistenciaProvider>
    </NotificationsProvider>
  </TaskProvider>
</AuthProvider>


  )
};






export default App;
