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
      {/* Título alineado a la izquierda */}
      <h2 className="text-[#03673E] font-semibold text-lg mb-6">
        Publicar en redes Sociales
      </h2>

      {/* Contenedor centrado */}
      <div className="border-black flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="border-2 p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h3 className="text-center text-green-900 text-lg font-semibold mb-6">
            Publicar <span className="text-green-700">Actividades Sociales</span>
          </h3>

          <div className="mb-4">
            <label className="block mb-1">Descripción</label>
            <input
              type="text"
              placeholder="Descripción de la actividad"
              className="w-full p-2 border rounded bg-white text-black"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Enlace</label>
            <input
              type="text"
              placeholder="Enlace de la actividad"
              className="w-full p-2 border rounded bg-white text-black"
              value={enlace}
              onChange={(e) => setEnlace(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">Selecciona red social</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex items-center gap-2 px-3 py-2 rounded text-white text-sm ${
                  redSocial === "Facebook" ? "bg-blue-700" : "bg-blue-500"
                }`}
                onClick={() => setRedSocial("Facebook")}
              >
                <FaFacebookF /> Facebook
              </button>
              <button
                type="button"
                className={`flex items-center gap-2 px-3 py-2 rounded text-white text-sm ${
                  redSocial === "Instagram" ? "bg-pink-700" : "bg-pink-500"
                }`}
                onClick={() => setRedSocial("Instagram")}
              >
                <FaInstagram /> Instagram
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Publicar
          </Button>
        </form>
      </div>
    </div>
  );
}
