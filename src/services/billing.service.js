import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const updateTripIssue = async (tripId, issueType, remarks) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.UPDATE_TRIP_FOR_ISSUE}/${tripId}/${issueType}`;
  if (remarks) {
    url += `/${remarks}`;
  }
  return axiosInstance.put(url).then((response) => {
    return response;
  });
};

const transferTrip = async (tripId, vehicleId) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.TRANSFER}/${tripId}/${vehicleId}`;
  return axiosInstance.put(url).then((response) => {
    return response;
  });
};

const resolveOpsIssue = async (tripId, issueType, remarks) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.RESOLVE_OPS_ISSUE}/${tripId}/${issueType}`;
  if (remarks) {
    url += `/${remarks}`;
  }
  return axiosInstance.put(url).then((response) => {
    return response;
  });
};

const calculateRoutewiseDistance = async (tripId, routeWiseDistance) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.CALCULATE}/${tripId}/${routeWiseDistance}`;
  return axiosInstance.put(url).then((response) => {
    return response;
  });
};

const deleteMember = async (tripId, memberId) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.DELETE_MEMBER}/${tripId}/${memberId}`;
  return axiosInstance.delete(url).then((response) => {
    return response;
  });
};

const createManualTrip = async (body) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.CREATE_MANUAL_TRIP}`;
  return axiosInstance.post(url, body).then((response) => {
    return response;
  });
};

const addMember = async (body) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.ADD_MEMBER}`;
  return axiosInstance.post(url, body).then((response) => {
    return response;
  });
};

const updateTrip = async (body) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.UPDATE_TRIP}`;
  return axiosInstance.post(url, body).then((response) => {
    return response;
  });
};

const billingOpsIssueSearchByBean = async (queryParams, searchValues) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.OPS_ISSUE}${API_PATH.SEARCH_BY_BEAN}`;
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return axiosInstance.post(url, searchValues).then((response) => {
    return response;
  });
};

const billingIssuesSearchByBean = async (queryParams, searchValues) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.BILLING_ISSUE}${API_PATH.SEARCH_BY_BEAN}`;
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return axiosInstance.post(url, searchValues).then((response) => {
    return response;
  });
};

const auditApproval = async (tripId, flag) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.AUDIT_APPROVAL}/${tripId}/${flag}`;
  return axiosInstance.post(url).then((response) => {
    return response;
  });
};

const billingAuditSearchByBean = async (queryParams, state, searchValues) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.AUDIT}${API_PATH.SEARCH_BY_BEAN}/${state}`;
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return axiosInstance.post(url, searchValues).then((response) => {
    return response;
  });
};

const billingTripMember = async (tripId) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.TRIP_MEMBERS}?tripId=${tripId}`;
  return axiosInstance.get(url).then((response) => {
    return response;
  });
};

const getTripHistory = async (tripId) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.TRIP_HISTORY}/${tripId}`;
  return axiosInstance.get(url).then((response) => {
    return response;
  });
};

const markNoShow = async (tripId, id, flag, driverFlag) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.MARK_NO_SHOW}/${tripId}/${id}/${flag}/${driverFlag}`;
  return axiosInstance.put(url).then((response) => {
    return response;
  });
};

const getIssueIdUsingTripId = async (tripId) => {
  // http://localhost:3000/api/v1/tripIssue/trip/73
  let url = `${API_PATH.API_VERSION}/tripIssue/trip/${tripId}`;
  return axiosInstance.get(url).then((response) => {
    return response;
  })
}

const getTripByTripId = async (tripId) => {
  ///api/v1/trip/search/{tripId}
  ///api/v1/trip/search/303
  return axiosInstance
    .get(`${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.SEARCH}/${tripId}`)
    .then((response) => {
      return response;
    });
};

const getTripByVehicleNumber = (queryParams) => {
  ///api/v1/trip/byVehicle
  ///api/v1/trip/byVehicle?vehicleNumber=DL04C1320&startDate=2024-10-18&endDate=2024-10-21
  let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.BY_VEHICLE}`;
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return axiosInstance.get(url).then((response) => {
    return response;
  });
};

const CalculatePackageBill = async (contractType, vendorId, startDate, endDate) => {
  ///api/v1/vendorCompany/calculatePackageBill
  ///api/v1/vendorCompany/calculatePackageBill
  let url = `${API_PATH.API_VERSION}${API_PATH.VENDOR_COMPANY}${API_PATH.CALCULATE_PACKAGE_BILL}?${API_PATH.CONTRACT_TYPE}=${contractType}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}`;
  return axiosInstance.get(url).then((response) => {
    return response;
  });
};

const CalculateBill = async (month, vendorId, startDate, endDate) => {
  ///api/v1/vendorCompany/calculateBill
  ///api/v1/vendorCompany/calculateBill
  let url = `${API_PATH.API_VERSION}${API_PATH.VENDOR_COMPANY}${API_PATH.CALCULATE_BILL}?month=${month}&vendorId=${vendorId}&startDate=${startDate}&endDate=${endDate}`;
  return axiosInstance.get(url).then((response) => {
    return response;
  });
};

const CalculateBillForAll = async (month, startDate, endDate) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.VENDOR_COMPANY}${API_PATH.GENERATE_BILL}?month=${month}&startDate=${startDate}&endDate=${endDate}`;
  return axiosInstance.get(url).then((response) => {
    return response;
  });
}

const allIssueSearchByBean = async (queryParams, searchValues) => {
  let url = `${API_PATH.API_VERSION}/tripIssue/allIssue?`;
  if (queryParams) {
    url += queryParams
  }
  return axiosInstance.post(url, searchValues).then((response) => {
    return response;
  })
}

const resolveBillingIssue = async (issueId, status) => {
  let url = `${API_PATH.API_VERSION}/tripIssue/resolveIssue/${issueId}/${status}`;
  return axiosInstance.post(url).then((response) => {
    return response;
  })
}

const billingOpsIssueApproval = async (tripId, flag) => {
  // http://localhost:3000/api/v1/billing/opsIssueApproval/73/true
  let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.OPS_ISSUE_APPROVAL}/${tripId}/${flag}`;
  return axiosInstance.post(url).then((response) => {
    return response;
  })
}

const createConfig = async (values) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.CONFIG}${API_PATH.CREATE}`;
  return axiosInstance.post(url, values).then((response) => {
    return response;
  })
}

const getAllConfig = async (queryParams) => {
  let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.CONFIG}${API_PATH.ALL}`;
  if(queryParams){
    url += `?queryParams`;
  }
  return axiosInstance.get(url).then((response) => {
    return response;
  })
}

const BillingService = {
  billingIssuesSearchByBean,
  addMember,
  createManualTrip,
  deleteMember,
  calculateRoutewiseDistance,
  transferTrip,
  updateTripIssue,
  billingTripMember,
  resolveOpsIssue,
  updateTrip,
  billingOpsIssueSearchByBean,
  auditApproval,
  billingAuditSearchByBean,
  getTripHistory,
  markNoShow,
  getTripByTripId,
  getTripByVehicleNumber,
  CalculatePackageBill,
  CalculateBill,
  allIssueSearchByBean,
  getIssueIdUsingTripId,
  resolveBillingIssue,
  billingOpsIssueApproval,
  createConfig,
  getAllConfig,
  CalculateBillForAll
};

export default BillingService;
