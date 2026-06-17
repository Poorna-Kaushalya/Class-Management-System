import axios from "axios";

const API = "http://localhost:5000/api";

// GET CURRENT USER
export const getCurrentUser = async () => {
  const token = localStorage.getItem("accessToken");

  const res = await axios.get(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// UPDATE USER
export const updateUser = async (data) => {
  const token = localStorage.getItem("accessToken");

  const res = await axios.put(
    "http://localhost:5000/api/auth/me",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};