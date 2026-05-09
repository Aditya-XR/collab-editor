import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getErrorMessage = (error) => {
  return error.response?.data?.message || "Image upload failed";
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/api/v1/upload/image", formData);
    return response.data.data.url;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
