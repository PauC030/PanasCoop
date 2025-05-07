import { useEffect } from "react";
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
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Convertir responsables de string a array
      const processedData = {
        ...data,
        responsible: data.responsible 
          ? data.responsible.split(',').map(r => r.trim()).filter(r => r !== '')
          : [],
        date: dayjs.utc(data.date).format(),
      };
  
      if (params.id) {
        await updateTask(params.id, processedData);
      } else {
        await createTask(processedData);
      }
  

       navigate("/tasks"); //aqui descomente esto para redirigir despues de guardar
    } catch (error) {
      console.log(error);

    }
  };

  useEffect(() => {
    const loadTask = async () => {
      if (params.id) {
        const task = await getTask(params.id);
        setValue("title", task.title);
        setValue("description", task.description);
        setValue(
          "date",
          task.date ? dayjs(task.date).utc().format("YYYY-MM-DD") : ""
        );
        setValue("place", task.place || ""); // Nuevo campo
       setValue("responsible", task.responsible ? task.responsible.join(", ") : ""); // Nuevo campo
        setValue("completed", task.completed);
      }
    };
    loadTask();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[90vh]">
    <Card className="w-full max-w-2xl mx-4">
    <h1 className="text-2xl font-bold text-[#165a4c] text-center mb-6">Crear Nueva Actividad</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="title">Titulo</Label>
        <Input
          type="text"
          name="title"
          placeholder="Title"
          {...register("title")}
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">Por favor, introduzca un título.</p>
        )}

        <Label htmlFor="description">Descripción</Label>
        <Textarea
          name="description"
          id="description"
          rows="3"
          placeholder="Description"
          {...register("description")}
        ></Textarea>

        <Label htmlFor="date">Fecha</Label>
        <Input type="date" name="date" {...register("date")} />


                {/* Nuevo campo: Lugar */}
                <Label htmlFor="place">Lugar de la actividad</Label>
        <Input
          type="text"
          name="place"
          placeholder="¿Dónde se realizará?"
          {...register("place")}
        />
        
        {/* Nuevo campo: Responsables */}
        <Label htmlFor="responsible">Responsables de la Actividad</Label>
        <Textarea
          name="responsible"
          placeholder="Ingresa los responsables, separados por comas"
          {...register("responsible")}
        />
        <p className="text-sm text-gray-500">Separa cada responsable con una coma</p>


        <Button>Crear</Button>
      </form>
    </Card>
    </div>
  );
}
