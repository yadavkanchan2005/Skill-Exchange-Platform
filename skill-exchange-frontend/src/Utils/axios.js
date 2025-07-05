import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log(token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized: Token may have expired");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
