import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "../utils/axios";

const getTripByTripId = (tripId) => {
  ///api/v1/trip/search/{tripId}
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.SEARCH}/${tripId}`)
    .then((response) => {
      return response;
    });
  s;
};

const getVehicleDriverMappingByVehicleId = (vehicleId) => {
  ///api/v1/vehicleDriverMapping/vehicle/{vehicleId}
  return axiosInstance
    .get(
      `${API_PATH.API_VERSION}${API_PATH.VEHICLE_DRIVER_MAPPING}${API_PATH.VEHICLE}/${vehicleId}`
    )
    .then((response) => {
      return response;
    });
};

const getVehicleDriverMappingByDriverId = (driverId) => {
  ///api/v1/vehicleDriverMapping/driver/{driverId}
  return axiosInstance
    .get(
      `${API_PATH.API_VERSION}${API_PATH.VEHICLE_DRIVER_MAPPING}${API_PATH.SINGLE_DRIVER}/${driverId}`
    )
    .then((response) => {
      return response;
    });
};

const getFeedbackSearchByBean = (queryParams, searchValues) => {
  ///api/v1/feedback/searchByBean
  ///api/v1/feedback/searchByBean?page=0&size=100
  let url = `${API_PATH.API_VERSION}${API_PATH.FEEDBACK}${API_PATH.SEARCH_BY_BEAN}`;
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return axiosInstance.post(url, searchValues).then((response) => {
    return response;
  });
};

const getChangeRequestSearchByBean = (queryParams, searchValues) => {
  ///api/v1/changeRequest/searchByBean
  ///api/v1/changeRequest/searchByBean?page=0&size=100
  let url = `${API_PATH.API_VERSION}${API_PATH.CHANGE_REQUEST}${API_PATH.SEARCH_BY_BEAN}`;
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return axiosInstance.post(url, searchValues).then((response) => {
    return response;
  });
};

const tripFeedbackUpdateStatus = async (id, status) => {
  ///api/v1/feedback/{id}/{status}
  ///api/v1/feedback/2/In%20Progress
  return axiosInstance
    .put(`${API_PATH.API_VERSION}${API_PATH.FEEDBACK}/${id}/${status}`)
    .then((response) => {
      return response;
    });
};

const changeRequestStatus = async (body) => {
  ///api/v1/changeRequest/processRequest
  return axiosInstance
    .post(
      `${API_PATH.API_VERSION}${API_PATH.CHANGE_REQUEST}${API_PATH.PROCESS_REQUEST}`,
      body
    )
    .then((response) => {
      return response;
    });
};

const getEmployeeById = (id) => {
  ///api/v1/emp/{id}
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.EMP}/${id}`)
    .then((response) => {
      return response;
    });
};

const TripService = {
  getTripByTripId,
  getVehicleDriverMappingByVehicleId,
  getVehicleDriverMappingByDriverId,
  getFeedbackSearchByBean,
  getChangeRequestSearchByBean,
  tripFeedbackUpdateStatus,
  changeRequestStatus,
  getEmployeeById,
};

export default TripService;
