import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const getAllOffices = () => {
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.OFFICES}${API_PATH.ALL}`)
    .then((response) => {
      return response;
    });
};

const createOfficeMapping = (data) => {
  return axiosInstance
    .post(
      `${API_PATH.API_VERSION}${API_PATH.OFFICE_MAPPINGS}${API_PATH.CREATE}`,
      data
    )
    .then((response) => {
      return response;
    });
};

const getOfficeMapping = (officeId) => {
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.OFFICE_MAPPINGS}/${officeId}`)
    .then((response) => {
      return response;
    });
};

const createEmployee = (data) => {
  console.log("create employee", data);
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.CREATE_EMPLOYEE}`, data)
    .then((response) => {
      return response;
    });
};

const updateEmployee = (data) => {
  console.log("update employee", data);
  return axiosInstance
    .put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_EMPLOYEE}`, data)
    .then((response) => {
      return response;
    });
};

const uploadForm = (data) => {
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.FILE_UPLOAD}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
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
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.CREATE_ESCORT}`, data)
    .then((response) => {
      return response;
    });
};

const updateEscort = (data) => {
  return axiosInstance
    .put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_ESCORT}`, data)
    .then((response) => {
      return response;
    });
};

const searchTeam = (text) => {
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.SEARCH_TEAM}${text}/0/15`)
    .then((response) => {
      return response;
    });
};

const searchRM = (text) => {
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.SEARCH_RM}${text}/0/15`)
    .then((response) => {
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
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.CREATE_ADMIN}`, data)
    .then((response) => {
      return response;
    });
};

const updateAdmin = (data) => {
  return axiosInstance
    .put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_ADMIN}`, data)
    .then((response) => {
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
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.CREATE_VENDOR}`, data)
    .then((response) => {
      return response;
    });
};

const updateVendor = (data) => {
  return axiosInstance
    .put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_VENDOR}`, data)
    .then((response) => {
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
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.CREATE_TEAM}`, data)
    .then((response) => {
      return response;
    });
};

const updateTeams = (data) => {
  return axiosInstance
    .put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_TEAM}`, data)
    .then((response) => {
      return response;
    });
};

const getAllHolidays = () => {
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.HOLIDAYS}${API_PATH.ALL}`)
    .then((response) => {
      return response;
    });
};

const addHoliday = (data) => {
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.HOLIDAYS}${API_PATH.CREATE}`, data)
    .then((response) => {
      return response;
    });
};

const removeHoliday = (holidayId) => {
  return axiosInstance
    .delete(
      `${API_PATH.API_VERSION}${API_PATH.HOLIDAYS}${API_PATH.DELETE}/${holidayId}`
    )
    .then((response) => {
      return response;
    });
};

const getEmployeeDetails = (id) => {
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.EMP_BY_ID}/${id}`)
    .then((response) => {
      return response;
    });
};

const raiseRequest = (data) => {
  ///api/v1/emp/raiseRequest
  console.log("Raised request address/phone: ", data);
  return axiosInstance
    .post(
      `${API_PATH.API_VERSION}${API_PATH.EMP}${API_PATH.RAISE_REQUEST}`,
      data
    )
    .then((response) => {
      return response;
    });
};

const getUserByEmail = (email) => {
  ///api/v1/emp/findByEmail/{email}
  ///api/v1/emp/findByEmail/saifali@gmail.com
  return axiosInstance
    .get(
      `${API_PATH.API_VERSION}${API_PATH.EMP}${API_PATH.FIND_BY_EMAIL}/${email}`
    )
    .then((response) => {
      return response;
    });
};

const createPreference = (data) => {
  ///api/v1/preference/create
  return axiosInstance
    .post(
      `${API_PATH.API_VERSION}${API_PATH.PREFERENCE}${API_PATH.CREATE}`,
      data
    )
    .then((response) => {
      return response;
    });
};

const getPreferenceById = (id) => {
  ///api/v1/preference/{id}
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.PREFERENCE}/${id}`)
    .then((response) => {
      return response;
    });
};

const raiseRequest = (data) => {
  ///api/v1/emp/raiseRequest
  console.log("Raised request address/phone: ", data);
  return axiosInstance
    .post(
      `${API_PATH.API_VERSION}${API_PATH.EMP}${API_PATH.RAISE_REQUEST}`,
      data
    )
    .then((response) => {
      return response;
    });
};

 
 const getUserByEmail = (email) => {
  ///api/v1/emp/findByEmail/{email}
  ///api/v1/emp/findByEmail/saifali@gmail.com
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.EMP}${API_PATH.FIND_BY_EMAIL}/${email}`)
    .then((response) => {
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
  getEmployeeDetails,
  uploadForm,
  raiseRequest,
  getUserByEmail,
  createPreference,
  getPreferenceById,
};

export default OfficeService;
