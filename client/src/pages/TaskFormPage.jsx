import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card, Input, Label } from "../components/ui";
import { useTasks } from "../context/tasksContext";
import { Textarea } from "../components/ui/Textarea";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
dayjs.extend(utc);


export function TaskFormPage() {
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast('Por favor selecciona solo archivos de imagen');
        e.target.value = '';
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast('La imagen es demasiado grande. Máximo 5MB');
        e.target.value = '';
        return;
      }

      setSelectedImage(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Limpiar imagen seleccionada
  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image-input');
    if (fileInput) fileInput.value = '';
  };

const onSubmit = async (data) => {
  const selectedDate = dayjs(data.date).startOf("day");
  const today = dayjs().startOf("day");

  if (selectedDate.isBefore(today)) {
    toast.error("No puedes seleccionar una fecha pasada.");
    return;
  }

  setIsSubmitting(true);
  try { 
    const taskData = {
      title: data.title || '',
      description: data.description || '',
      place: data.place || '',
      date: data.date ? dayjs.utc(data.date).format() : '',
    };
    
    // Responsables
    const responsibleList = data.responsible
      ? data.responsible.split(',').map(r => r.trim()).filter(r => r !== '')
      : [];
    
    if (responsibleList.length > 0) {
      taskData.responsible = responsibleList;
    }
    
    // Imagen (solo si existe)
    if (selectedImage) {
      taskData.image = selectedImage;
    }

    console.log("Datos a enviar:", taskData);

    if (params.id) {
      await updateTask(params.id, taskData);
    } else {
      await createTask(taskData);
    }

    navigate("/tasks");
  } catch (error) {
    console.error('Error al guardar:', error);
    toast.error('Error al guardar la actividad. Por favor intenta de nuevo.');
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    const loadTask = async () => {
      if (params.id) {
        try {
          const task = await getTask(params.id);
          setValue("title", task.title);
          setValue("description", task.description);
          setValue(
            "date",
            task.date ? dayjs(task.date).utc().format("YYYY-MM-DD") : ""
          );
          setValue("place", task.place || "");
          setValue("responsible", task.responsible ? task.responsible.join(", ") : "");
          
          if (task.image) {
            setImagePreview(task.image);
          }
        } catch (error) {
          console.error('Error al cargar tarea:', error);
        }
      }
    };
    loadTask();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-start justify-center pt-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-10">
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {params.id ? "Editar Actividad" : "Nueva Actividad"}
          </h1>
          <p className="text-gray-600">
            {params.id ? "Actualiza los detalles de tu actividad" : "Crea una nueva actividad"}
          </p>
        </div>

       
        
        <form onSubmit={handleSubmit(onSubmit)} 
          className="p-8 space-y-0 bg-gray-100 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold text-green-900 border-b border-gray-300 pb-2 px-8 pt-6">
           Detalles de la Actividad:
          </h2>
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                Título de la Actividad
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="title"
                maxLength={90}
                placeholder="Ej: Reunión de equipo, Capacitación, Evento..."
                {...register("title", { required: "El título es requerido" })}
                className="border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg transition-all duration-200"
                autoFocus
              />
              {errors.title && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
                Descripción
              </Label>
              <Textarea
                name="description"
                id="description"
                rows="4"
                placeholder="Describe los objetivos, agenda o detalles importantes de la actividad..."
                {...register("description")}
                className="border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg transition-all duration-200 resize-none"
              />
            </div>

            {/* Fecha y Lugar en grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fecha */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Fecha
                </Label>
                <Input 
                  type="date" 
                  name="date" 
                  {...register("date")}
                  className="border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg transition-all duration-200"
                />
              </div>

              {/* Lugar */}
              <div className="space-y-2">
                <Label htmlFor="place" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Lugar
                </Label>
                <Input
                  type="text"
                  name="place"
                  maxLength={40}
                  placeholder="Sala de reuniones, Oficina central, Virtual..."
                  {...register("place")}
                  className="border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg transition-all duration-200"
                />
              </div>
            </div>

            {/* Responsables */}
            <div className="space-y-2">
              <Label htmlFor="responsible" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
                Responsables
              </Label>
              <Textarea
                name="responsible"
                maxLength={70}
                rows="2"
                placeholder="Juan Pérez, María García, Carlos López..."
                {...register("responsible")}
                className="border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg transition-all duration-200 resize-none"
              />
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Separa cada responsable con una coma
              </p>
            </div>

            {/* Imagen */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Imagen de la Actividad
                <span className="text-sm font-normal text-gray-500">(opcional)</span>
              </Label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors duration-200">
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label 
                  htmlFor="image-input" 
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Haz clic para subir una imagen</p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF hasta 5MB</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Preview de la imagen */}
            {imagePreview && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Vista Previa:</Label>
                <div className="relative inline-block bg-gray-50 p-4 rounded-lg">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-64 object-contain rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors duration-200"
                    title="Eliminar imagen"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                onClick={() => navigate("/tasks")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 py-3 rounded-lg transition-all duration-200"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white border-0 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {params.id ? "Actualizando..." : "Creando..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 px-2 py-0 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {params.id ? "Actualizar Actividad" : "Crear Actividad"}
                  </div>
                )}
              </Button>
            </div>
          </form>
       
      </div>
    </div>
  );
}