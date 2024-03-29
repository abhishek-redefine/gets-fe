import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const getAllOffices = () => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.OFFICES}${API_PATH.ALL}`).then((response) => {
        return response;
    });
};

const createOfficeMapping = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.OFFICE_MAPPINGS}${API_PATH.CREATE}`, data).then((response) => {
        return response;
    });
};

const getOfficeMapping = (officeId) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.OFFICE_MAPPINGS}/${officeId}`).then((response) => {
        return response;
    });
};

const createEmployee = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_EMPLOYEE}`, data).then((response) => {
        return response;
    });
};

const updateEmployee = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_EMPLOYEE}`, data).then((response) => {
        return response;
    });
};

const getAllEmployees = (queryParams) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.EMPLOYEE_LISTING}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.get(url).then((response) => {
        return response;
    });
};

const getAllEscorts = (queryParams) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.ESCORT_LISTING}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.get(url).then((response) => {
        return response;
    });
};

const createEscort = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_ESCORT}`, data).then((response) => {
        return response;
    });
};

const updateEscort = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_ESCORT}`, data).then((response) => {
        return response;
    });
};

const searchTeam = (text) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SEARCH_TEAM}${text}/0/15`).then((response) => {
        return response;
    });
};

const searchRM = (text) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SEARCH_RM}${text}/0/15`).then((response) => {
        return response;
    });
};

const getAllAdmins = (queryParams) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.ADMIN_LISTING}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.get(url).then((response) => {
        return response;
    });
};

const createAdmin = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_ADMIN}`, data).then((response) => {
        return response;
    });
};

const updateAdmin = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_ADMIN}`, data).then((response) => {
        return response;
    });
};

const getAllVendors = (queryParams) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.VENDOR_LISTING}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.get(url).then((response) => {
        return response;
    });
};

const createVendor = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_VENDOR}`, data).then((response) => {
        return response;
    });
};

const updateVendor = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_VENDOR}`, data).then((response) => {
        return response;
    });
};

const getAllTeams = (queryParams) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.TEAM_LISTING}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.get(url).then((response) => {
        return response;
    });
};

const createTeams = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_TEAM}`, data).then((response) => {
        return response;
    });
};

const updateTeams = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_TEAM}`, data).then((response) => {
        return response;
    });
};

const getAllHolidays = () => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.HOLIDAYS}${API_PATH.ALL}`).then((response) => {
        return response;
    });
};

const addHoliday = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.HOLIDAYS}${API_PATH.CREATE}`, data).then((response) => {
        return response;
    });
};

const removeHoliday = (holidayId) => {
    return axiosInstance.delete(`${API_PATH.API_VERSION}${API_PATH.HOLIDAYS}${API_PATH.DELETE}/${holidayId}`).then((response) => {
        return response;
    });
};

const getEmployeeDetails = (id) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.EMP_BY_ID}/${id}`).then((response) => {
        return response;
    });
};

const OfficeService = {
    getAllOffices,
    createEmployee,
    getAllEmployees,
    updateEmployee,
    searchTeam,
    searchRM,
    getAllEscorts,
    createEscort,
    updateEscort,
    getAllAdmins,
    createAdmin,
    updateAdmin,
    getAllVendors,
    createVendor,
    updateVendor,
    getAllTeams,
    createTeams,
    updateTeams,
    createOfficeMapping,
    getOfficeMapping,
    getAllHolidays,
    addHoliday,
    removeHoliday,
    getEmployeeDetails
};

export default OfficeService;
