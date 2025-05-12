  import React, { useState } from "react";
  import { FaFacebookF, FaInstagram } from "react-icons/fa";
  import { Button } from "../ui";

  export function PublicarRedes() {
    const [descripcion, setDescripcion] = useState("");
    const [enlace, setEnlace] = useState("");
    const [redSocial, setRedSocial] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Publicando en:", redSocial, descripcion, enlace);
      // Aquí puedes integrar con la API o lógica de publicación
    };

    return (
      <div className="bg-white min-h-screen p-6">
        {/* Título principal */}
        <h2 className="text-[#03673E] font-semibold text-lg mb-6">
          Publicar en Redes Sociales
        </h2>

        {/* Contenedor del formulario */}
        <div className="border-2 bg-white shadow-md p-8 rounded-md max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-center text-green-900 text-xl font-semibold">
              Publica tu Actividad
            </h3>

            {/* Campo Descripción */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Descripción</label>
              <input
                type="text"
                placeholder="Descripción de la actividad"
                className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-600"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            {/* Campo Enlace */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Enlace</label>
              <input
                type="text"
                placeholder="Enlace de la actividad"
                className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-600"
                value={enlace}
                onChange={(e) => setEnlace(e.target.value)}
                required
              />
            </div>

            {/* Selección de Red Social */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Selecciona red social</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded text-white text-sm transition-all ${
                    redSocial === "Facebook" ? "bg-[#0173ED]" : "bg-[#4da3f7]"
                  }`}
                  onClick={() => setRedSocial("Facebook")}
                >
                  <FaFacebookF /> Facebook
                </button>

                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded text-white text-sm transition-all ${
                    redSocial === "Instagram" ? "bg-pink-700" : "bg-pink-500"
                  }`}
                  onClick={() => setRedSocial("Instagram")}
                >
                  <FaInstagram /> Instagram
                </button>
              </div>
            </div>

            {/* Botón Publicar */}
            <Button
              type="submit"
              className="w-full bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700 transition-all shadow"
            >
              Publicar
            </Button>
          </form>
        </div>
      </div>
    );
  }
