import { useState } from "react";

export default function ActivityFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    status: "",
    promoted: "",
    search: "",
    date: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      status: "",
      promoted: "",
      search: "",
      date: ""
    });
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 ">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 ">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Buscar</label>
          <input
            type="text" 
            name="search"
            id="search"
            placeholder="Buscar por título, descripción o lugar"
            value={filters.search}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 text-bla focus:ring-green-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="sr-only  text-black">Estado</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm "
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="promoted" className="sr-only">Promoción</label>
          <select
            id="promoted"
            name="promoted"
            value={filters.promoted}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            <option value="">Todas</option>
            <option value="true">Promocionadas</option>
            <option value="false">No promocionadas</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black  bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}