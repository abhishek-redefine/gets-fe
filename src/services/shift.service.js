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

const updateShift = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.SHIFT_UPDATE}`, data).then((response) => {
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
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.post(url).then((response) => {
        return response;
    });
};

const getAllShiftSearchByBean = (queryParams,data) =>{
    let url = `${API_PATH.API_VERSION}${API_PATH.SHIFT_LISTING_ALL}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.post(url,data).then((response) => {
        return response;
    });
}

const enableDisableShifts = (id, isEnable) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.SHIFT_ENABLE_DISABLE}/${id}/${isEnable}`;

    return axiosInstance.put(url).then((response) => {
        return response;
    });
};

const shiftTeamZoneMapping = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_SHIFT}${API_PATH.SHIFT_TEAM_MAPPING}`, data).then((response) => {
        return response;
    });
};

const ShiftService = {
    getMasterData,
    createShift,
    getAllShifts,
    getAllShiftsWOPagination,
    enableDisableShifts,
    updateShift,
    shiftTeamZoneMapping,
    getAllShiftSearchByBean
};

export default ShiftService;
