import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "../utils/axios";
import { headers } from "../../next.config";

const createDriver = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_DRIVER}`, data).then((response) => {
        return response;
    });
};

const updateDriver = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_DRIVER}`, data).then((response) => {
        return response;
    });
};

const updateVehicle = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_VEHICLE}`, data).then((response) => {
        return response;
    });
};

const getSingleDriver = (id) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SINGLE_DRIVER}/${id}`).then((response) => {
        return response;
    });
};

const getSingleVehicle = (id) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SINGLE_VEHICLE}/${id}`).then((response) => {
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

const documentUpload = (id, role, documentToUpload, data) => {
    console.log(data)
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.DOCUMENT_UPLOAD}${id}${role}${documentToUpload}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
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

const getAllEHS = () => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.EHS_LISTING_ALL}`).then((response) => {
        return response;
    });
};

const getSelectedVehicleEHS = (id) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SELECTED_VEHICLE_EHS}${id}`).then((response) => {
        return response;
    });
};

const getSelectedDriverEHS = (id) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SELECTED_DRIVER_EHS}${id}`).then((response) => {
        return response;
    });
};

const getAllPenalty = () => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.PENALTY_LISTING_ALL}`).then((response) => {
        return response;
    });
};

const createEHS = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_EHS}`, data).then((response) => {
        return response;
    });
};

const updateEHS = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_EHS}`, data).then((response) => {
        return response;
    });
};

const createVehicle = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_VEHICLE}`, data).then((response) => {
        return response;
    });
};

const createPenalty = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_PENALTY}`, data).then((response) => {
        return response;
    });
};

const createVendorCompany = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_VENDOR_COMPANY}`, data).then((response) => {
        return response;
    });
};

const searchDriver = (text) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SEARCH_DRIVER}${text}/0/15`).then((response) => {
        return response;
    });
};

const updateVendorCompany = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_VENDOR_COMPANY}`, data).then((response) => {
        return response;
    });
};

const updatePenalty = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_PENALTY}`, data).then((response) => {
        return response;
    });
};

const enableDisableDriver = (id, isEnable) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.ENABLE_DISABLE_DRIVER}/${id}/${isEnable}`).then((response) => {
        return response;
    });
};

const enableDisableVehicle = (id, isEnable) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.ENABLE_DISABLE_VEHICLE}/${id}/${isEnable}`).then((response) => {
        return response;
    });
};

const getAllVendorCompany = () => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.VENDOR_COMPANY_LISTING}`).then((response) => {
        return response;
    });
};

const downloadAWSFile = (name) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.AWS_BUCKET}${API_PATH.AWS_BUCKET_NAME}${API_PATH.AWS_DOWNLOAD}${name}`).then((response) => {
            return response;
        });
};

const vehicleDriverMapping = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.VEHICLE_DRIVER_MAPPING}`, data).then((response) => {
        return response;
    });
};

const approveDriver = (id, approval) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.APPROVE_COMPLIANCE}/${id}/${approval}`).then((response) => {
        return response;
    });
};

const enableDisableVendor = (id, enableOrDisable) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.ENABLE_DISABLE_VENDOR}/${id}/${enableOrDisable}`).then((response) => {
        return response;
    });
};

const approveVehicle = (id, approval) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.APPROVE_COMPLIANCE_VEHICLE}/${id}/${approval}`).then((response) => {
        return response;
    });
};

const addEhsEntryDriver = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.ADD_EHS_ENTRY_DRIVER}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then((response) => {
        return response;
    });
};

const addEhsEntryVehicle = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.ADD_EHS_ENTRY_VEHICLE}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then((response) => {
        return response;
    });
};


const ComplianceService = {
    createDriver,
    getMasterData,
    getAllDrivers,
    documentUpload,
    getAllVehicles,
    getAllEHS,
    createEHS,
    getAllPenalty,
    createPenalty,
    updatePenalty,
    getAllVendorCompany,
    updateDriver,
    getSingleDriver,
    enableDisableDriver,
    downloadAWSFile,
    approveDriver,
    createVehicle,
    updateVehicle,
    getSingleVehicle,
    approveVehicle,
    createVendorCompany,
    updateVendorCompany,
    searchDriver,
    enableDisableVehicle,
    vehicleDriverMapping,
    updateEHS,
    enableDisableVendor,
    addEhsEntryDriver,
    addEhsEntryVehicle,
    getSelectedVehicleEHS,
    getSelectedDriverEHS
};

export default ComplianceService;
