import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import registerImage from '../assets/image login2.jpg';
function Register() {
  const { signup, errors: registerErrors, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (value) => {
    await signup(value);
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/tasks");
  }, [isAuthenticated]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex rounded-xl overflow-hidden shadow-2xl w-full max-w-6xl h-[70vh] min-h-[550px] -mt-14">
        
        {/* Imagen a la izquierda */}
        <div className="w-1/1 bg-[#165a4c] relative">
          <img 
            src={registerImage} 
            alt="Imagen decorativa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-8">
            <h2 className="text-white text-3xl font-bold text-center">
              Únete a PanascOOP y vive la experiencia completa
            </h2>
          </div>
        </div>

        {/* Formulario a la derecha */}
        <Card className="p-6 w-1/2 rounded-none shadow-none flex flex-col justify-between">
  <div className="w-full max-w-md mx-auto">
    <h1 className="text-2xl font-bold text-[#165a4c] text-center mb-6">Registrarse</h1>

    {registerErrors.map((error, i) => (
      <Message message={error} key={i} />
    ))}

    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Label className="block text-gray-700 mb-1 text-base">Nombre de usuario</Label>
        <Input
          type="text"
          placeholder="Escribe tu nombre"
          className="bg-[#dde6e2] rounded-md px-3 py-2 text-base placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
          {...register("username")}
        />
        <p className="text-red-500 text-sm mt-1">{errors.username?.message}</p>
      </div>

      <div>
        <Label className="block text-gray-700 mb-1 text-base">Correo electrónico</Label>
        <Input
          type="email"
          placeholder="ramona@gmail.com"
          className="bg-[#dde6e2] rounded-md px-3 py-2 text-base placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
          {...register("email")}
        />
        <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
      </div>

      <div>
        <Label className="block text-gray-700 mb-1 text-base">Contraseña</Label>
        <Input
          type="password"
          placeholder="********"
          className="bg-[#dde6e2] rounded-md px-3 py-2 text-base placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
          {...register("password")}
        />
        <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
      </div>

      <div>
        <Label className="block text-gray-700 mb-1 text-base">Confirmar Contraseña</Label>
        <Input
          type="password"
          placeholder="********"
          className="bg-[#dde6e2] rounded-md px-3 py-2 text-base placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
          {...register("confirmPassword")}
        />
        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword?.message}</p>
      </div>

      <Button className="bg-[#165a4c] text-white rounded-md px-4 py-3 text-base shadow-lg hover:bg-[#144736] transition mt-4">
        Registrarse
      </Button>
    </form>

    <p className="mt-5 text-gray-500 text-center text-base">
      ¿Ya tienes una cuenta?{" "}
      <Link to="/login" className="text-blue-500 hover:underline font-medium">
        Inicia sesión
      </Link>
    </p>
  </div>
</Card>
      </div>
    </div>
  );
}

export default Register;