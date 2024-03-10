import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "../utils/axios";

const createDriver = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_DRIVER}`, data).then((response) => {
        return response;
    });
};

const getAllDrivers = () => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.DRIVER_LISTING_ALL}`).then((response) => {
        return response;
    });
};

const getAllVehicles = () => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.VEHICLE_LISTING_ALL}`).then((response) => {
        return response;
    });
};

const documentUpload = (id,role,documentToUpload, data) => {
    console.log(data)
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.DOCUMENT_UPLOAD}${id}${role}${documentToUpload}`, data, {
        headers: {
            "Content-Type":"multipart/form-data"
        }
    }).then((response) => {
        return response;
    });
};

const getMasterData = (type) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.MASTER_DATA}${type}`).then((response) => {
        return response;
    });
};

const ComplianceService = {
    createDriver,
    getMasterData,
    getAllDrivers,
    documentUpload,
    getAllVehicles
};

export default ComplianceService;
