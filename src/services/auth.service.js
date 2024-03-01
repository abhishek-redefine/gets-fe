import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const login = (userDetails) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.LOGIN}`, userDetails).then((response) => {
        return response;
    });
};

const refreshToken = (token) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.REFRESH_TOKEN}`, token, {
        headers: {
            dontSendToken: true
        }
    }).then((response) => {
        return response;
    });
};

const getUserRole = (userId) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.USER_ROLE}${userId}`).then((response) => {
        return response;
    });
};

const logout = () => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.LOGOUT}`).then((response) => {
        return response;
    });
};

const AuthService = {
    login,
    getUserRole,
    refreshToken,
    logout
};

export default AuthService;
