import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const login = (userDetails) => {
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.LOGIN}`, userDetails)
    .then((response) => {
      return response;
    });
};

const refreshToken = (token) => {
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.REFRESH_TOKEN}`, token, {
      headers: {
        dontSendToken: true,
      },
    })
    .then((response) => {
      return response;
    });
};

const getUserRole = (userId) => {
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.USER_ROLE}${userId}`)
    .then((response) => {
      return response;
    });
};

const logout = () => {
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.LOGOUT}`)
    .then((response) => {
      return response;
    });
};

const changePassword = (body) => {
  ///api/v1/user/password/change
  ///api/v1/user/password/change
  return axiosInstance
    .put(
      `${API_PATH.API_VERSION}${API_PATH.USER}${API_PATH.PASSWORD}${API_PATH.CHANGE}`,
      body
    )
    .then((response) => {
      return response;
    });
};

const forgetPassword = (body) => {
  ///api/v1/user/forget/password
  ///api/v1/user/forget/password
  return axiosInstance
    .post(
      `${API_PATH.API_VERSION}${API_PATH.USER}${API_PATH.FORGET}${API_PATH.PASSWORD}`,
      body
    )
    .then((response) => {
      return response;
    });
};

const resetPassword = (queryParams, body) => {
  ///api/v1/user/reset/password/{userId}/{token}
  ///api/v1/user/reset/password?userId=saifali@gmail.com&token=UjHOg6QzwVjQsYmVEw254czidElr2H
  let url = `${API_PATH.API_VERSION}${API_PATH.USER}${API_PATH.RESET}${API_PATH.PASSWORD}`;
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return axiosInstance.post(url, body).then((response) => {
    return response;
  });
};

const AuthService = {
  login,
  getUserRole,
  refreshToken,
  logout,
  changePassword,
  forgetPassword,
  resetPassword,
};

export default AuthService;
