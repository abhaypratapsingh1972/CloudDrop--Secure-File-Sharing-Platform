import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://clouddrop-api.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
