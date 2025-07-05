import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: 'https://skill-exchange-platform-pamq.onrender.com',
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
