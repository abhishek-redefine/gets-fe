import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "../utils/axios";

const getMasterData = (type) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.MASTER_DATA}${type}`).then((response) => {
        return response;
    });
};

const createShift = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_SHIFT}`, data).then((response) => {
        return response;
    });
};

const getAllShifts = (queryParams) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.SHIFT_LISTING}`;
    // if (queryParams) {
    //     url += `?${queryParams}`;
    // }
    return axiosInstance.get(url).then((response) => {
        return response;
    });
};

const getAllShiftsWOPagination = (queryParams) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.SHIFT_LISTING_ALL}`;
    // if (queryParams) {
    //     url += `?${queryParams}`;
    // }
    return axiosInstance.get(url).then((response) => {
        return response;
    });
};

const ShiftService = {
    getMasterData,
    createShift,
    getAllShifts,
    getAllShiftsWOPagination
};

export default ShiftService;
