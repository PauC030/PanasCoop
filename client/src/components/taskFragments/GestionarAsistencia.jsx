import React, { useState, useEffect } from 'react';
import { useAsistencia } from "../../context/asistenciaContext";
import { Button } from '../ui';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/tasksContext';
import Papa from 'papaparse';
import { Bell, BellOff, Calendar, CheckCircle, X, Edit2, Trash2, Loader2, Plus, Clipboard, Save, Inbox } from 'lucide-react';

function ParticipantModal({ isOpen, onClose, onSave, attendeeToEdit, existingEmails, existingNames }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (attendeeToEdit) {
      setName(attendeeToEdit.name);
      setEmail(attendeeToEdit.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [attendeeToEdit, isOpen]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error('Correo electrónico no válido');
      return;
    }

    const isDuplicateEmail = !attendeeToEdit && existingEmails.includes(email);
    const isDuplicateName = !attendeeToEdit && existingNames.includes(name);

    if (isDuplicateEmail || isDuplicateName) {
      toast.error('Nombre o correo ya registrados');
      return;
    }

    onSave({ name, email });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {attendeeToEdit ? (
                <>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">✏️</span>
                  </div>
                  Editar Participante
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">👤</span>
                  </div>
                  Nuevo Participante
                </>
              )}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <span className="text-gray-400 text-xl">×</span>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Nombre completo
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa el nombre completo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              {attendeeToEdit ? 'Actualizar' : 'Agregar'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Confirmar eliminación</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex gap-3">
            <button 
              onClick={onConfirm} 
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              Eliminar
            </button>
            <button 
              onClick={onClose} 
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GestionarAsistencia() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks, getTasks } = useTasks();
  const {
    attendees,
    deleteAttendance,
    createAttendee,
    updateAttendance,
    fetchAttendees,
  } = useAsistencia();

  const queryParams = new URLSearchParams(location.search);
  const taskIdFromUrl = queryParams.get("taskId");

  const [isModalOpen, setModalOpen] = useState(false);
  const [attendeeToEdit, setAttendeeToEdit] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [attendeeToDelete, setAttendeeToDelete] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await getTasks();
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("Error al cargar las actividades");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!taskIdFromUrl) {
      setFilteredAttendees([]);
      return;
    }
    
    const task = tasks.find((t) => t._id === taskIdFromUrl);
    if (task) {
      setSelectedTask(task);
      fetchAttendees(taskIdFromUrl);
    } else if (tasks.length > 0) {
      // Auto-seleccionar la primera tarea si no hay una seleccionada
      const firstTask = tasks[0];
      setSelectedTask(firstTask);
      navigate(`/tasks/asistencia?taskId=${firstTask._id}`);
      fetchAttendees(firstTask._id);
    }
  }, [taskIdFromUrl, tasks, navigate]);

  useEffect(() => {
    if (taskIdFromUrl) {
      const filtered = attendees.filter((a) => a.task === taskIdFromUrl);
      setFilteredAttendees(filtered);
    }
  }, [attendees, taskIdFromUrl]);

  const handleEdit = (id) => {
    const found = filteredAttendees.find((a) => a._id === id);
    setAttendeeToEdit(found);
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    const found = filteredAttendees.find((a) => a._id === id);
    setAttendeeToDelete(found);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAttendance(attendeeToDelete._id);
      toast.success("Participante eliminado correctamente");
      fetchAttendees(taskIdFromUrl);
      setConfirmModalOpen(false);
    } catch (error) {
      toast.error("Error al eliminar participante");
      console.error("Delete error:", error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmModalOpen(false);
    setAttendeeToDelete(null);
  };

  const handleAdd = () => {
    setAttendeeToEdit(null);
    setModalOpen(true);
  };
  
  const handleSave = async (data) => {
    try {
      if (attendeeToEdit) {
        await updateAttendance(attendeeToEdit._id, data);
        toast.success("Participante actualizado correctamente");
      } else {
        await createAttendee({ ...data, task: taskIdFromUrl });
        toast.success("Participante agregado correctamente");
      }

      await fetchAttendees(taskIdFromUrl);
      setModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      toast.error(
        err.response?.data?.message || "Error al guardar participante"
      );
    }
  };

  const handleExport = () => {
    if (!filteredAttendees.length) {
      toast.error("No hay participantes para exportar");
      return;
    }

    const csv = Papa.unparse(
      filteredAttendees.map(({ name, email }) => ({
        Nombre: name,
        Correo: email,
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `asistentes-${selectedTask?.title || "actividad"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Lista exportada correctamente");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
  <div className="p-6 max-w-3xl mx-auto sm:max-w-[90vw] sm:ml-10 sm:mr-10">
    {/* Header Section */}
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          👥 Gestión de Asistencia
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
      </div>
      <p className="text-gray-600 ml-4">
        Administra los participantes de tus actividades
      </p>

          {/* Task Selection and Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                {selectedTask ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                     <Clipboard className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Actividad seleccionada</p>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h2>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Selecciona una actividad para gestionar su asistencia</p>
                  </div>
                )}
              </div>
              
              <div className="lg:w-80">
                <select
                  value={taskIdFromUrl || ""}
                  onChange={(e) => {
                    const newTaskId = e.target.value;
                    if (newTaskId) {
                      navigate(`/tasks/asistencia?taskId=${newTaskId}`);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
                >
                  <option value="">Seleccionar actividad</option>
                  {tasks.map((task) => (
                    <option key={task._id} value={task._id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {(taskIdFromUrl || (selectedTask && tasks.length > 0)) && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Stats and Actions Header */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">{filteredAttendees.length}</span>
                      <span className="text-gray-600 text-sm">participantes</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md"
                  >
                    <span className="text-sm text-white">+</span>
                    <span className="text-white">Agregar Participante</span>
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200 transition-all duration-200 shadow-sm"
                  >
                   <Inbox className="text-blue-600" size={16} />
                    <span className="text-gray-700">Exportar Lista</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Participants Table */}
            <div className="overflow-x-auto">
              {filteredAttendees.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                        Participante
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                        Correo Electrónico
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900 text-sm">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAttendees.map((attendee, index) => (
                      <tr key={attendee._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {attendee.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{attendee.name}</p>
                              <p className="text-sm text-gray-500">Participante #{index + 1}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-700">{attendee.email}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(attendee._id)}
                              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteClick(attendee._id)}
                              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-3xl">👤</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay participantes registrados
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Comienza agregando el primer participante a esta actividad
                  </p>
                  <button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
                  >
                    <span className="text-white">Agregar Primer Participante</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals */}
        <ParticipantModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          attendeeToEdit={attendeeToEdit}
          existingEmails={filteredAttendees.map((a) => a.email)}
          existingNames={filteredAttendees.map((a) => a.name)}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          message={`¿Estás seguro que deseas eliminar a ${attendeeToDelete?.name}?`}
        />
      </div>
    </div>
  );
}