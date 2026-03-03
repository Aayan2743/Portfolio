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

    // Check for admin token first
    const adminToken = localStorage.getItem("token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";
    
    // Check for user token (portfolio visitor)
    const userToken = localStorage.getItem("portfolio_user_token");
    
    // Prioritize admin token, fallback to user token
    const token = adminToken || userToken;
    
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
      // Clear admin tokens
      localStorage.removeItem("token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("portfolio_admin_session");
      
      // Clear user tokens
      localStorage.removeItem("portfolio_user_token");
      localStorage.removeItem("portfolio_user_data");
      
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
