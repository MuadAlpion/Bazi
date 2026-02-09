import axios from "axios";
import useAdmin from "../store/useAdmin";

const apiAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiAdmin.interceptors.request.use((config) => {
  const token = useAdmin.getState().token; // ✅ ใช้ admin token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiAdmin;
