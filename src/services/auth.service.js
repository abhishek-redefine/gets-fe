import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const signup = (userDetails) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.SIGNUP}`, userDetails).then((response) => {
        return response;
    });
};


const AuthService = {
    signup
};

export default AuthService;
