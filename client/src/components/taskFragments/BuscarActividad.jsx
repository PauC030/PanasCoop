import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui";

export function BuscarActividad() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  return (
    <div className="bg-white p-6 min-h-screen">
      {/* Título fuera del border y alineado a la izquierda */}
      <h2 className="text-[#03673E] font-semibold text-lg mb-6">
        Buscar y Filtrar Actividades
      </h2>

      {/* Contenedor con border y sombra similar al otro componente */}
      <div className="border-2 rounded-md p-6 shadow-lg">
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-left">
            Buscar por palabra clave (título o descripción)
          </label>
          <div className="relative flex items-center">
            <Search className="text-gray-400 w-4 h-4 absolute left-3" />
            <input
              type="text"
              placeholder="Ejemplo: alimentos, plaza, recolección"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-600 pl-10" // Añadí un padding a la izquierda para hacer espacio al ícono
            />
          </div>
        </div>

        {/* Filtros en línea */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Filtro por fecha */}
          <div>
            <label className="block text-gray-700 mb-2">Filtrar por fecha</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Todas</option>
              <option value="proximas">Próximas</option>
              <option value="pasadas">Pasadas</option>
            </select>
          </div>

          {/* Filtro por lugar */}
          <div>
            <label className="block text-gray-700 mb-2">Filtrar por lugar</label>
            <input
              type="text"
              placeholder="Ejemplo: Plaza Central"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-gray-700 mb-2">Filtrar por estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Todas</option>
              <option value="promocionadas">Promocionadas</option>
            </select>
          </div>
        </div>

        {/* Botón BUSCAR */}
        <div className="text-left">
          <Button className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-2 rounded shadow hover:brightness-110 uppercase">
            BUSCAR
          </Button>
        </div>
      </div>
    </div>
  );
}
