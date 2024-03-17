import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const getAllRoles = () => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.ROLE}`).then((response) => {
        return response;
    });
};

const getRolesByType = (type) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.ROLE}/${type}`).then((response) => {
        return response;
    });
};

const getAllModules = () => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.MODULE}`).then((response) => {
        return response;
    });
};

const getRolePermissions = (role) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.ROLE_PERMISSION}/${role}`).then((response) => {
        return response;
    });
};

const saveRolePermissions = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.ROLE_PERMISSION}`, data).then((response) => {
        return response;
    });
};

const updateRolePermissions = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.ROLE_PERMISSION}`, data).then((response) => {
        return response;
    });
};

const uploadForm = (x) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.FILE_UPLOAD}`, x, {
        headers: {
            "Content-Type":"multipart/form-data"
        }
    }).then((response) => {
        console.log(response)
    });
    // return axiosInstance.post(`${API_PATH.API_VERSION}/document/uploadCertificates/1/VEHICLE/FITNESS_CERTIFICATE`, x)
    //     .then((response) => {
    //         console.log(response)
    //     });
};


const RoleService = {
    getAllRoles,
    getAllModules,
    getRolePermissions,
    saveRolePermissions,
    updateRolePermissions,
    getRolesByType,
    uploadForm
};

export default RoleService;
