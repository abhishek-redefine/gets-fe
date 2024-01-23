// utils/axios.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // You can add other Axios configurations here
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
      let userToken = localStorage.getItem('token');
      if (userToken && config?.headers) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
      return config;
    },
    (error) => {
      // Handle request error
      return Promise.reject(error);
    }
  );
  
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;