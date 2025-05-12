import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes";

import { SearchProvider } from "./context/searchContext"; 
import { BuscarActividad } from "./components/taskFragments/BuscarActividad";
import { ListaActividades } from "./components/taskFragments/ListaActividades";
import { ActividadesPromocionadas } from "./components/taskFragments/ActividadesPromocionadas";
import { ConfigurarNotificaciones } from "./components/taskFragments/ConfigurarNotificaciones";
import { PublicarRedes } from "./components/taskFragments/PublicarRedes";
import { GestionarAsistencia } from "./components/taskFragments/GestionarAsistencia";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import { LoginPage } from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { TaskProvider } from "./context/tasksContext";


function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <SearchProvider> 
          <BrowserRouter>
            <main className="content-container mx-auto md:px-0">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/tasks" element={<TasksPage />}>
                    <Route path="buscar" element={<BuscarActividad />} />
                    <Route path="lista" element={<ListaActividades />} />
                    <Route path="promocionadas" element={<ActividadesPromocionadas />} />
                    <Route path="notificaciones" element={<ConfigurarNotificaciones />} />
                    <Route path="publicar" element={<PublicarRedes />} />
                    <Route path="asistencia" element={<GestionarAsistencia />} />
                  </Route>
                  <Route path="/add-task" element={<TaskFormPage />} />
                  <Route path="/tasks/:id" element={<TaskFormPage />} />
                  <Route path="/profile" element={<h1>Profile</h1>} />
                </Route>
              </Routes>
            </main>
          </BrowserRouter>
        </SearchProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
