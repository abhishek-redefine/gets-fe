import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const getAllSummary = async (searchValues) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.SUMMARY}`;
  console.log(searchValues, url);
  return axiosInstance.post(url, searchValues).then((response) => {
    return response;
  });
};

const generateTrips = async (body) => {
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.GENERATE}`, body)
    .then((response) => {
      return response;
    });
};

const downloadTrip = async (shiftId, tripDate) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.DOWNLOAD_TRIP}`;
  if (shiftId && tripDate) {
    url += `?shiftId=${shiftId}&tripDate=${tripDate}`;
  }
  return axiosInstance.get(url).then((response) => {
    return response;
  });
};

const tripMembers = async (id) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.TRIP_MEMBERS}?tripId=${id}`;
  return axiosInstance.get(url).then((response) => {
    return response;
  });
};

const replicateTrip = async (body) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.REPLICATE}`;
  return axiosInstance.post(url, body).then((response) => {
    return response;
  });
};

const getTripByShiftIdAndTripDate = async (queryParams) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.SHIFTID_TRIP_DATE}`;
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return axiosInstance.get(url).then((response) => {
    return response;
  });
};

const generateDummyTrip = async (body) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.DUMMY_TRIP}`;
  return axiosInstance.put(url, body).then((response) => {
    return response;
  });
};

const deleteTrip = async (tripId) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.DELETE_TRIP}`;
  if (tripId) {
    url += `/${tripId}`;
  }
  return axiosInstance.delete(url).then((response) => {
    return response;
  });
};

const DispatchService = {
  getAllSummary,
  generateTrips,
  downloadTrip,
  tripMembers,
  replicateTrip,
  getTripByShiftIdAndTripDate,
  generateDummyTrip,
  deleteTrip,
};

export default DispatchService;
