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

const getAllDrivers = (queryParams, searchValues) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.DRIVER_LISTING_ALL}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.post(url, searchValues).then((response) => {
        return response;
    });
};

const getAllVehicles = (queryParams, searchValues) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.VEHICLE_LISTING_ALL}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.post(url, searchValues).then((response) => {
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

const getAllEHS = (queryParams, searchValues) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.EHS_LISTING_SEARCHBYBEAN}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.post(url, searchValues).then((response) => {
        return response;
    });
};

const getAllEHSByDriverId = (driverId) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.EHS_LISTING_BY_DRIVERID}${driverId}`).then((response) =>{
        return response;
    })
}

const getAllEhsByVehicleId = (vehicleId) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.EHS_LISTING_BY_VEHICLEID}${vehicleId}`).then((response) =>{
        return response;
    })
}

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

const searchDriverWithVendor = (text,vendorName) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SEARCH_DRIVER_WITH_VENDOR}${vendorName}/${text}/0/15`).then((response) => {
        return response;
    });
}

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

const enableDisableDriver = (id, isEnable,remark) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.ENABLE_DISABLE_DRIVER}/${id}/${isEnable}/${remark}`).then((response) => {
        return response;
    });
};

const enableDisableVehicle = (id, isEnable,remark) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.ENABLE_DISABLE_VEHICLE}/${id}/${isEnable}/${remark}`).then((response) => {
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

const approveDriver = (id, approval,remarks) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.APPROVE_COMPLIANCE}/${id}/${approval}/${remarks}`).then((response) => {
        return response;
    });
};

const enableDisableVendor = (id, enableOrDisable) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.ENABLE_DISABLE_VENDOR}/${id}/${enableOrDisable}`).then((response) => {
        return response;
    });
};

const approveVehicle = (id, approval,remarks) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.APPROVE_COMPLIANCE_VEHICLE}/${id}/${approval}/${remarks}`).then((response) => {
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

const updateDriverEhs = (data) =>{
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_EHS_ENTRY_DRIVER}`,data,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then((response)=>{
        return response;
    })
}

const updateVehicleEhs = (data) =>{
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_EHS_ENTRY_VEHICLE}`,data,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then((response)=>{
        return response;
    })
}

const addEhsEntryVehicle = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.ADD_EHS_ENTRY_VEHICLE}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then((response) => {
        return response;
    });
};

const searchVendor = (text) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SEARCH_VENDOR}${text}/0/15`).then((response) => {
        return response;
    });
}

const searchVehicle = (text) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SEARCH_VEHICLE}${text}/0/15`).then((response) => {
        return response;
    });
}

const getVendorCompanyById = (id) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.VENDOR_COMPANY}/${id}`).then((response) => {
        return response;
    });
}

const enableDisableVendorCompany = (id, isEnable,remarks) =>{
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.VENDOR_COMPANY}/enable/${id}/${isEnable}/${remarks}`).then((response)=>{
        return response;
    })
}

const changeStatusDriver = (id) =>{
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.SINGLE_DRIVER}${API_PATH.CHANGE_STATUS}${id}`).then((response)=>{
        return response;
    })
}

const changeStatusVehicle = (id) =>{
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.SINGLE_VEHICLE}${API_PATH.CHANGE_STATUS}${id}`).then((response)=>{
        return response;
    })
}

const getAllVehiclesMapping = (queryParams,searchValues) =>{
    let url = `${API_PATH.API_VERSION}${API_PATH.VEHICLE_DRIVER_MAPPING_BEAN}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.post(url, searchValues).then((response) => {
        return response;
    })
}

const forceMappingVehicle = (id,value) =>{
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.VEHICLE_DRIVER_FORCE_MAPPING}${id}`,value).then((response)=>{
        return response;
    })
}

const getDriverById = (id) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SINGLE_DRIVER}/${id}`).then((response)=>{
        return response;
    })
}

const getVehicleById = (id) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SINGLE_VEHICLE}/${id}`).then((response)=>{
        return response;
    })
}

const getEhsHistoryByDriverId = (id,date) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.EHS_INSPECTION}${API_PATH.SINGLE_DRIVER}/${id}${API_PATH.HISTORY}${date}`).then((response)=>{
        return response;
    })
}

const getEhsHistoryByVehicleId = (id,date) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.EHS_INSPECTION}${API_PATH.SINGLE_VEHICLE}/${id}${API_PATH.HISTORY}${date}`).then((response)=>{
        return response;
    })
}


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
    getSelectedDriverEHS,
    searchVendor,
    getVendorCompanyById,
    enableDisableVendorCompany,
    changeStatusDriver,
    changeStatusVehicle,
    searchDriverWithVendor,
    getAllVehiclesMapping,
    forceMappingVehicle,
    getDriverById,
    getVehicleById,
    searchVehicle,
    getAllEHSByDriverId,
    getAllEhsByVehicleId,
    updateDriverEhs,
    updateVehicleEhs,
    getEhsHistoryByDriverId,
    getEhsHistoryByVehicleId
};

export default ComplianceService;
