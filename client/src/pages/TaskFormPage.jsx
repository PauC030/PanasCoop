import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card, Input, Label } from "../components/ui";
import { useTasks } from "../context/tasksContext";
import { Textarea } from "../components/ui/Textarea";
import { useForm } from "react-hook-form";
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
        alert('Por favor selecciona solo archivos de imagen');
        e.target.value = ''; // Limpiar el input
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Máximo 5MB');
        e.target.value = ''; // Limpiar el input
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
    // Limpiar el input file
    const fileInput = document.getElementById('image-input');
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Preparar los datos
      const processedData = {
        title: data.title,
        description: data.description || '',
        place: data.place || '',
        date: data.date ? dayjs.utc(data.date).format() : null,
        responsible: data.responsible 
          ? data.responsible.split(',').map(r => r.trim()).filter(r => r !== '')
          : [],
      };

      // Agregar imagen si se seleccionó una
      if (selectedImage) {
        processedData.image = selectedImage;
      }

      console.log('Datos a enviar:', processedData); // Para debug

      if (params.id) {
        await updateTask(params.id, processedData);
      } else {
        await createTask(processedData);
      }

      navigate("/tasks");
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la actividad. Por favor intenta de nuevo.');
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
          
          // Si la tarea tiene imagen, mostrar preview
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
    <div className="flex items-center justify-center min-h-[90vh] mt-16">
      <Card className="w-full max-w-2xl mx-4">
        <h1 className="text-2xl font-bold text-[#165a4c] text-center mb-6">
          {params.id ? "Editar Actividad" : "Crear Nueva Actividad"}
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="title">Título*</Label>
          <Input
            type="text"
            name="title"
            maxLength={90}
            placeholder="Título de la actividad"
            {...register("title", { required: "El título es requerido" })}
            autoFocus
          />
          {errors.title && (
            <p className="text-red-500 text-xs italic mb-2">{errors.title.message}</p>
          )}

          <Label htmlFor="description">Descripción</Label>
          <Textarea
            name="description"
            id="description"
            rows="3"
            placeholder="Describe la actividad"
            {...register("description")}
          />

          <Label htmlFor="date">Fecha</Label>
          <Input type="date" name="date" {...register("date")} />

          <Label htmlFor="place">Lugar de la actividad</Label>
          <Input
            type="text"
            name="place"
            maxLength={40}
            placeholder="¿Dónde se realizará?"
            {...register("place")}
          />
          
          <Label htmlFor="responsible">Responsable de la Actividad</Label>
          <Textarea
            name="responsible"
            maxLength={70}
            placeholder="Ingresa el responsable"
            {...register("responsible")}
          />
          <p className="text-sm text-gray-500 mb-4">Separa cada responsable con una coma</p>

          {/* Campo para subir imagen */}
          <Label htmlFor="image">Imagen de la actividad (opcional)</Label>
          <div className="mb-4">
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-1">
              Formatos soportados: JPG, PNG, GIF. Máximo 5MB
            </p>
          </div>

          {/* Preview de la imagen */}
          {imagePreview && (
            <div className="mb-4">
              <Label>Vista previa:</Label>
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-64 object-contain rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  title="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (params.id ? "Actualizando..." : "Creando...") 
              : (params.id ? "Actualizar" : "Crear")
            }
          </Button>
        </form>
      </Card>
    </div>
  );
}