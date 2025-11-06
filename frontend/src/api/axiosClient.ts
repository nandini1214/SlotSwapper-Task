  import axios from "axios";

  const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000", 
  });

  axiosClient.interceptors.request.use((config) => {
    const token = localStorage?.getItem("access_token");
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export default axiosClient;
