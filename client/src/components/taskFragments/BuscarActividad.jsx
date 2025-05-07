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

      <div className="border-2 bg-white shadow-md p-4 rounded-md flex flex-wrap items-center gap-3">
        {/* Campo de búsqueda */}
        <div className="flex items-center bg-[#d3d3d3] rounded px-2 w-full md:w-auto">
          <Search className="text-black w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por título o des..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-black outline-none px-2 py-1 w-full placeholder:text-black"
          />
        </div>

        {/* Filtro de fecha */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-[#d3d3d3] text-black rounded px-2 py-1 outline-none w-full md:w-auto"
        >
          <option value="">Fecha</option>
          <option value="todas">Todas</option>
          <option value="proximas">Próximas</option>
          <option value="pasadas">Pasadas</option>
        </select>

        {/* Lugar */}
        <input
          type="text"
          placeholder="Lugar"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-[#d3d3d3] text-black rounded px-2 py-1 outline-none w-full md:w-auto placeholder:text-black"
        />

        {/* Estado */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-[#d3d3d3] text-black rounded px-2 py-1 outline-none w-full md:w-auto"
        >
          <option value="">Estado</option>
          <option value="Todas">Todas</option>
          <option value="Promocionadas">Promocionadas</option>
        </select>

        {/* Botón Buscar */}
        <Button className="bg-blue-600 text-white rounded px-4 py-1 shadow hover:bg-blue-700 transition-all">
          Buscar
        </Button>
      </div>
    </div>
  );
}
