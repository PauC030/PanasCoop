import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";
import loginImage from '../assets/image login2.jpg';

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated]);


  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex rounded-xl overflow-hidden shadow-2xl w-full max-w-6xl h-[70vh] min-h-[550px] -mt-14">
        {/* Sección del formulario (mitad izquierda) */}
        <Card className="p-10 w-1/2 rounded-none shadow-none flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-[#165a4c] text-center mb-8">Inicia sesión</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div>
                <Label className="block text-gray-700 mb-2 text-lg">Correo electrónico</Label>
                <Input
                  type="email"
                  placeholder="Correo Electronico"
                  className="bg-[#dde6e2] rounded-lg px-4 py-3 text-lg placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
                  {...register("email", { required: true})}
                />
                <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
              </div>

              <div>
                <Label className="block text-gray-700 mb-2 text-lg">Contraseña</Label>
                <Input
                  type="password"
                  placeholder="********"
                  className="bg-[#dde6e2] rounded-lg px-4 py-3 text-lg placeholder-gray-400 border-none focus:ring-2 focus:ring-[#165a4c] w-full"
                  {...register("password", { required: true, minLength: 6 })}
                />
                <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
              </div>

              <Button className="bg-[#165a4c] text-white rounded-lg px-6 py-4 text-lg shadow-lg hover:bg-[#144736] transition mt-6">
                Iniciar sesión
              </Button>
            </form>

            <p className="mt-6 text-gray-500 text-center text-lg">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-blue-500 hover:underline font-medium">
                Regístrate
              </Link>
            </p>
          </div>

          {loginErrors.map((error, i) => (
            <Message message={error} key={i} />
          ))}
        </Card>
        
        {/* Sección de la imagen (mitad derecha) */}
        <div className="w-1/1 bg-[#165a4c] relative">
          <img 
            src={loginImage} 
            alt="Imagen decorativa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-8">
            <h2 className="text-white text-3xl font-bold text-center">
              Descubre todo lo que PanascOOP tiene para ofrecerte
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}