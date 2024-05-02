import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const getAllZones = () => {
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.ZONE}${API_PATH.ALL}`)
    .then((response) => {
      return response;
    });
};

const createZone = (value) => {
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.ZONE}${API_PATH.CREATE}`, value)
    .then((response) => {
      return response;
    });
};

const enableDisableZone = (id, flag) => {
  return axiosInstance
    .put(
      `${API_PATH.API_VERSION}${API_PATH.ZONE}${API_PATH.ENABLE}/${id}/${flag}`
    )
    .then((response) => {
      return response;
    });
};

const getZonesByOfficeId = (id) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.ZONE}${API_PATH.ALL}`;
  url += `?officeId=${id}&page=0&size=25`;
  return axiosInstance.get(url).then((response) => {
    return response;
  });
};

const createArea = (values) => {
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.AREA}${API_PATH.CREATE}`, values)
    .then((response) => {
      return response;
    });
};

const getAllArea = () => {
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.AREA}${API_PATH.SEARCH_BY_BEAN}`)
    .then((response) => {
      return response;
    });
};

const enableDisableArea = (id, flag) => {
  return axiosInstance
    .put(
      `${API_PATH.API_VERSION}${API_PATH.AREA}${API_PATH.ENABLE}/${id}/${flag}`
    )
    .then((response) => {
      return response;
    });
};

const getAllNodalPoints = (params, values) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.NODAL}${API_PATH.SEARCH_BY_BEAN}`;
  if (params) {
    url += `?${params}`;
  }
  return axiosInstance.post(url, values).then((response) => {
    return response;
  });
};

const createNodalPoint = (values) => {
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.NODAL}${API_PATH.CREATE}`, values)
    .then((response) => {
      return response;
    });
};

const enableDisableNodalPoint = (id, flag) => {
  return axiosInstance
    .put(
      `${API_PATH.API_VERSION}${API_PATH.NODAL}${API_PATH.ENABLE}/${id}/${flag}`
    )
    .then((response) => {
      return response;
    });
};

const getAllHomeRoutes = () => {
  console.log("Need api");
  // return axiosInstance
  // .get(`${API_PATH.API_VERSION}${API_PATH.HOME}${API_PATH.HOME_ROUTE}`)
};

const getAllBusRoute = () => {
  let url = `${API_PATH.API_VERSION}${API_PATH.BUS_ROUTE}${API_PATH.SEARCH_BY_BEAN}`;
  return axiosInstance.post(url).then((response) => {
    return response;
  });
};

const getAllShuttleRoute = () => {
  let url = `${API_PATH.API_VERSION}${API_PATH.SHUTTLE_ROUTE}${API_PATH.SEARCH_BY_BEAN}`;
  return axiosInstance.post(url).then((response) => {
    return response;
  });
};

const RoutingService = {
  getAllZones,
  createZone,
  enableDisableZone,
  getZonesByOfficeId,
  createArea,
  getAllArea,
  enableDisableArea,
  getAllNodalPoints,
  createNodalPoint,
  enableDisableNodalPoint,
  getAllHomeRoutes,
  getAllBusRoute,
  getAllShuttleRoute,
};
export default RoutingService;
