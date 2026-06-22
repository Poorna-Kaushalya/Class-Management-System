import axios from "axios";

const API = "http://localhost:5000/api/teachers";

// attach token automatically
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getTeachers = () => api.get("/teachers");
export const deleteTeacher = (id) => api.delete(`/teachers/${id}`);
export const createTeacher = (data) => api.post("/teachers", data);
export const updateTeacher = (id, data) =>
  api.put(`/teachers/${id}`, data);