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
  return axiosInstance.get(url, { responseType: 'arraybuffer' }).then((response) => {
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
  return axiosInstance.post(url, body).then((response) => {
    return response;
  });
};

const deleteTrip = async (ids) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.DELETE_TRIPS}`;
  return axiosInstance.post(url, { ids }).then((response) => {
    return response;
  });
};

const getTripSearchByBean = async (queryParams, searchValues) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.SEARCH_BY_BEAN}`;
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return axiosInstance.post(url, searchValues).then(response => {
    return response;
  })
}

const generateB2bTrip = async (b2BTripDTO) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.B2B}${API_PATH.CREATE}`;
  return axiosInstance.post(url, b2BTripDTO).then(response => {
    return response;
  })
}

const allocateVendor = async (vendorId, tripIds) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.ALLOCATION}${API_PATH.VENDOR}`;
  if (vendorId) {
    url += `?vendorId=${vendorId}`;
  }
  return axiosInstance.post(url, tripIds).then(response => {
    return response;
  })
}

const allocateVehicle = async (tripId, vehicleId) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.ALLOCATION}${API_PATH.VEHICLE}`;
  if (tripId && vehicleId) {
    url += `?vehicleId=${vehicleId}&tripId=${tripId}`;
  }
  return axiosInstance.post(url).then(response => {
    return response;
  });
}

const autoSuggestVehicleByVendor = async (vendor, text) => {
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.SEARCH_VEHICLE_BY_VENDOR}/${vendor}/${text}/0/15`)
    .then((response) => {
      return response;
    });
}

const assignVehicle = async (tripId, VehicleId) => {
  return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.ALLOCATION}${API_PATH.VEHICLE}?tripId=${tripId}&vehicleId=${VehicleId}`).then(
    response => {
      return response
    }
  )
}

const getAllB2B = async () => {
  return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.B2B}${API_PATH.ALL}?page=0&size=100`).then(
    response => {
      return response;
    }
  )
}

const deleteB2B = async (b2bId) => {
  return axiosInstance.delete(`${API_PATH.API_VERSION}${API_PATH.B2B}${API_PATH.DELETE_TRIP}/${b2bId}`).then(
    response => {
      return response;
    }
  )
}

const addPenalty = async (body) => {
  return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.APPLY_PENALTY_ON_TRIP}`, body).then(
    response => {
      return response;
    }
  )
}

const addOpsIssue = async (tripId, tripState, remark) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.UPDATE_TRIP_FOR_ISUUE}/${tripId}/${tripState}/${remark}`;
  return axiosInstance.put(url).then(response => {
    return response;
  })
}

const createCabSticker = async (payload) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.STICKER}${API_PATH.GENERATE}`;
  return axiosInstance.post(url, payload).then(response => {
    return response;
  })
}

const DispatchService = {
  getAllSummary,
  generateTrips,
  downloadTrip,
  tripMembers,
  replicateTrip,
  getTripByShiftIdAndTripDate,
  generateDummyTrip,
  deleteTrip,
  getTripSearchByBean,
  generateB2bTrip,
  allocateVendor,
  allocateVehicle,
  autoSuggestVehicleByVendor,
  assignVehicle,
  getAllB2B,
  deleteB2B,
  addPenalty,
  addOpsIssue,
  createCabSticker
};

export default DispatchService;
