import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui";
import { useSearch } from "../../context/searchContext";
import { TaskCard } from "../tasks/TaskCard";

export function BuscarActividad() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const { searchTasks, results, loading } = useSearch();

  const handleBuscar = () => {
    searchTasks({
      q: search,
      place: location,
      estado: status,
      date: dateFilter,
    });
  };

  return (
    <div className="text-black bg-white p-6 min-h-screen w-full max-w-screen mx-auto">
      <h2 className="text-[#03673E] font-semibold text-lg mb-6">
      🔍 Buscar y Filtrar Actividades
      </h2>

      <div className="border-2 rounded-md p-6 shadow-lg">
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
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-green-600 pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

        <div className="text-left">
          <Button
            className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-2 rounded shadow hover:brightness-110 uppercase"
            onClick={handleBuscar}
          >
            BUSCAR
          </Button>
        </div>
      </div>

{/* Resultados de búsqueda */}
<div className="mt-6">
  {loading && <p>Buscando actividades...</p>}
  
  {!loading && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {results.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">
          No se encontraron actividades
        </div>
      ) : (
        results.map((task) => {
          const showPromoBadge = task.estado === "promocionadas";
          return (
            <TaskCard
              key={task._id}
              task={task}
              showPromoBadge={showPromoBadge}
            />
          );
        })
      )}
    </div>
  )}
</div>

    </div>
  );
}