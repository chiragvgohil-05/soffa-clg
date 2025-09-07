// src/apiClient.js
import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 0, // ♾️ disables timeout
});

// ✅ Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// ✅ Dynamic request methods
const request = {
    get: (url, params = {}, config = {}) =>
        apiClient.get(url, { params, ...config }),

    post: (url, data = {}, config = {}) =>
        apiClient.post(url, data, config),

    put: (url, data = {}, config = {}) =>
        apiClient.put(url, data, config),

    patch: (url, data = {}, config = {}) =>
        apiClient.patch(url, data, config),

    delete: (url, config = {}) =>
        apiClient.delete(url, config),
};

export default request;
