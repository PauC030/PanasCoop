import axios from "./axios";

export const searchTasksRequest = async ({ q, date, place, estado }) => {
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (date) params.append("date", date);
  if (place) params.append("place", place);
  if (estado) params.append("estado", estado);

  return await axios.get(`/tasks/search?${params.toString()}`);
};
