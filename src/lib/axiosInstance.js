import axios from "axios";

const apiClient = axios.create({
  baseURL:"http://192.168.1.3:8000/api/",
  timeout: 10000,
});
apiClient.interceptors.request.use(
  (config) => {
    const isFormDataRequest =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (isFormDataRequest && config.headers) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
        config.headers.delete("content-type");
      } else if (typeof config.headers.set === "function") {
        config.headers.set("Content-Type", undefined);
      } else {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }

    const token = localStorage.getItem("token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// ✅ Handle 401 Errors Globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("portfolio_admin_session");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
