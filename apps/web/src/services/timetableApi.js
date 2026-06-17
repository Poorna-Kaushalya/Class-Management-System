import axios from "axios";

const API = "http://localhost:5000/api/timetable";

function getAuthConfig() {
  const token = localStorage.getItem("accessToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// GET (public)
export async function fetchTimetable(subject) {
  const res = await axios.get(API, {
    params: subject ? { subject } : {},
  });
  return res.data;
}

// CREATE (admin)
export async function createTimetableRow(data) {
  const res = await axios.post(API, data, getAuthConfig());
  return res.data;
}

// UPDATE (admin)
export async function updateTimetableRow(id, data) {
  const res = await axios.put(`${API}/${id}`, data, getAuthConfig());
  return res.data;
}

// DELETE (admin)
export async function deleteTimetableRow(id) {
  const res = await axios.delete(`${API}/${id}`, getAuthConfig());
  return res.data;
}