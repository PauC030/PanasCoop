import { createContext, useContext, useState } from "react";
import { searchTasksRequest } from "../api/search";

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};

export function SearchProvider({ children }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchTasks = async (filters) => {
    setLoading(true);
    try {
      const res = await searchTasksRequest(filters);
      setResults(res.data);
    } catch (error) {
      console.error("Error buscando tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider value={{ results, loading, searchTasks }}>
      {children}
    </SearchContext.Provider>
  );
}
