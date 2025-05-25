
import React, { useState, useEffect } from 'react';
import { useAsistencia } from "../../context/asistenciaContext"; // en lugar de useTasks
import { Button } from '../ui';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/tasksContext';
import Papa from 'papaparse';

// Modal interno
function ParticipantModal({ isOpen, onClose, onSave, attendeeToEdit, existingEmails, existingNames }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (attendeeToEdit) {
      setName(attendeeToEdit.name);
      setEmail(attendeeToEdit.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [attendeeToEdit]);

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[300px]">
        <h2 className="text-lg font-semibold mb-4">
          {attendeeToEdit ? 'Editar Participante' : 'Agregar Participante'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            required
          />
          <input
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            required
          />
          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
              Guardar
            </button>
            <button type="button" onClick={onClose} className="text-red-600">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GestionarAsistencia() {
  const location = useLocation();
  const navigate = useNavigate();
   const { tasks, getTasks } = useTasks(); // Añade getTasks
  const {
    attendees,
    deleteAttendee,
    createAttendee,
    updateAttendee,
    fetchAttendees
  } = useAsistencia();

  // Obtener taskId de la URL
  const queryParams = new URLSearchParams(location.search);
  const taskIdFromUrl = queryParams.get('taskId');

  // Estado local
  const [isModalOpen, setModalOpen] = useState(false);
  const [attendeeToEdit, setAttendeeToEdit] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
     const loadData = async () => {
      try {
        await getTasks(); // Cargar las tareas primero
        if (taskIdFromUrl) {
          const task = tasks.find(t => t._id === taskIdFromUrl);
          setSelectedTask(task);
          
          if (task) {
            await fetchAttendees(taskIdFromUrl);
            const filtered = attendees.filter(a => a.task === taskIdFromUrl);
            setFilteredAttendees(filtered);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [taskIdFromUrl, tasks, fetchAttendees]);

  // Handlers
  const handleEdit = (id) => {
    const found = filteredAttendees.find((a) => a._id === id);
    setAttendeeToEdit(found);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteAttendee(id);
    toast.success('Participante eliminado');
  };

  const handleAdd = () => {
    setAttendeeToEdit(null);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (attendeeToEdit) {
        await updateAttendee(attendeeToEdit._id, data);
        toast.success('Participante actualizado');
      } else {
        // Asegurarse de asociar el asistente con la tarea actual
        await createAttendee({
          ...data,
          task: taskIdFromUrl
        });
        toast.success('Participante agregado');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error('Error al guardar participante');
    }
  };

  const handleExport = () => {
    if (!filteredAttendees.length) {
      toast.error('No hay participantes para exportar');
      return;
    }

    const csv = Papa.unparse(filteredAttendees.map(({ name, email }) => ({ 
      Nombre: name, 
      Correo: email 
    })));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `asistentes-${selectedTask?.title || 'actividad'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTaskChange = (e) => {
    const newTaskId = e.target.value;
    if (newTaskId) {
      navigate(`/gestion-asistencia?taskId=${newTaskId}`);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black relative">
     
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-green-700 mb-2">
            ✅ Gestión de asistencia
          </h1>
          {selectedTask && (
            <h2 className="text-lg font-medium">
              Actividad: <span className="text-green-600">{selectedTask.title}</span>
            </h2>
          )}
        </div>

        {/* Selector de actividad */}
        <select 
          value={taskIdFromUrl || ''}
          onChange={(e) => {
            const newTaskId = e.target.value;
            if (newTaskId) {
              navigate(`/tasks/asistencia?taskId=${newTaskId}`);
            }
          }}
          className="border p-2 rounded"
        >
          <option value="">Seleccionar otra actividad</option>
          {tasks.map(task => (
            <option key={task._id} value={task._id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>


      <div className="bg-white shadow-xl p-4 rounded-md border-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">
            Lista de Participantes ({filteredAttendees.length})
          </h2>
          <div className="flex gap-2">
            <Button onClick={handleAdd}>Agregar Participante</Button>
            <Button onClick={handleExport}>Exportar Lista</Button>
          </div>
        </div>

        {filteredAttendees.length > 0 ? (
          <table className="w-full border-collapse text-black">
            <thead>
              <tr className="bg-gray-200 text-left text-sm">
                <th className="py-2 px-4 font-semibold">Nombre</th>
                <th className="py-2 px-4 font-semibold">Correo Electrónico</th>
                <th className="py-2 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee) => (
                <tr key={attendee._id} className="border-b">
                  <td className="py-2 px-4">{attendee.name}</td>
                  <td className="py-2 px-4">{attendee.email}</td>
                  <td className="py-2 px-4">
                    <button 
                      onClick={() => handleEdit(attendee._id)} 
                      className="text-blue-600 mr-4 hover:underline"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(attendee._id)} 
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay participantes registrados para esta actividad
          </div>
        )}
      </div>

      <ParticipantModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        attendeeToEdit={attendeeToEdit}
        existingEmails={filteredAttendees.map(a => a.email)}
        existingNames={filteredAttendees.map(a => a.name)}
      />
    </div>
  );
}