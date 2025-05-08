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
      <h2 className="text-[#03673E] font-semibold text-lg mb-4">
        Buscar y Filtrar Actividades
      </h2>

      <div className="border-2 bg-white shadow-md p-6 rounded-md">
        {/* Campo de búsqueda centrado */}
        <div className="mb-4 flex flex-col items-center">
          <label className="block text-sm text-gray-700 mb-1 text-center">
            Buscar por palabra clave (título o descripción)
          </label>
          <div className="flex items-center bg-[#d3d3d3] rounded px-2 w-full md:w-2/3">
            <Search className="text-black w-4 h-4" />
            <input
              type="text"
              placeholder="Ejemplo: alimentos, plaza, recolección"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-black outline-none px-2 py-1 w-full placeholder:text-black"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Filtro por fecha */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Filtrar por fecha</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-[#d3d3d3] text-black rounded px-2 py-2 outline-none w-full"
            >
              <option value="">Todas</option>
              <option value="proximas">Próximas</option>
              <option value="pasadas">Pasadas</option>
            </select>
          </div>

          {/* Filtro por lugar */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Filtrar por lugar</label>
            <input
              type="text"
              placeholder="Ejemplo: Plaza Central"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-[#d3d3d3] text-black rounded px-2 py-2 outline-none w-full placeholder:text-black"
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Filtrar por estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#d3d3d3] text-black rounded px-2 py-2 outline-none w-full"
            >
              <option value="">Todas</option>
              <option value="Promocionadas">Promocionadas</option>
            </select>
          </div>
        </div>

        {/* Botón Buscar */}
        <div className="flex justify-end">
          <Button className="bg-blue-600 text-white rounded px-4 py-2 shadow hover:bg-blue-700 transition-all">
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
}
