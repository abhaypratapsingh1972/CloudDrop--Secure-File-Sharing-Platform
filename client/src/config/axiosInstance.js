import axios from "axios";

const BASE_URL="https://clouddrop-api.onrender.com/api/"
const axiosInstance=axios.create()

axiosInstance.defaults.baseURL=BASE_URL;

export default axiosInstance;