// utils/axios.js

import AuthService from '@/services/auth.service';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // You can add other Axios configurations here
});

const refreshTokenAPI = async () => {
  let tokenForRefresh = localStorage.getItem('token');
  if (tokenForRefresh) {
    try {
      const response = await AuthService.refreshToken({token: tokenForRefresh});
      const { data } = response || {};
      const { accessToken, token } = data || {};
      if (accessToken && token) {
        localStorage.setItem("token", token);
        localStorage.setItem("accessToken", accessToken);
        return true;
      } else {
        localStorage.clear();
        window.location.href = "/";
        return false;
      }
    } catch (e) {
      localStorage.clear();
      window.location.href = "/";
      console.error(e);
      return false;
    }
  } else {
    localStorage.clear();
    window.location.href = "/";
    return false;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
      let userToken = localStorage.getItem('accessToken');
      let allHeaders = config?.headers;
      if (userToken && allHeaders && !allHeaders?.dontSendToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
      return config;
    },
    (error) => {
      console.error("error", error);
      // Handle request error
      return Promise.reject(error);
    }
  );
  
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const isRefreshed = await refreshTokenAPI();
          if (isRefreshed) {
            return axiosInstance(originalRequest);
          }
        } catch (e) {
          return Promise.reject(e);
        }
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;