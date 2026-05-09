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
  return error.response?.data?.message || "Something went wrong";
};

export const getDocument = async (documentId) => {
  try {
    const response = await api.get(`/api/v1/documents/${documentId}`);
    return response.data.data.document;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const saveDocumentContent = async (documentId, latestSnapshot) => {
  try {
    const response = await api.patch(`/api/v1/documents/${documentId}/content`, {
      latestSnapshot
    });
    return response.data.data.document;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
