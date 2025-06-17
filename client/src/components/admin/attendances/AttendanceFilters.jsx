import { useState } from "react";

export default function AttendanceFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    activityId: "",
    userId: "",
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
      activityId: "",
      userId: "",
      date: ""
    });
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
        <div>
          <label htmlFor="activityId" className="sr-only">ID Actividad</label>
          <input
            type="text"
            name="activityId"
            id="activityId"
            placeholder="ID Actividad"
            value={filters.activityId}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="userId" className="sr-only">ID Usuario</label>
          <input
            type="text"
            name="userId"
            id="userId"
            placeholder="ID Usuario"
            value={filters.userId}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="sr-only">Fecha</label>
          <input
            type="date"
            name="date"
            id="date"
            value={filters.date}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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