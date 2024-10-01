import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const updateTripIssue = async (tripId, issueType, remarks) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.UPDATE_TRIP_FOR_ISSUE}/${tripId}/${issueType}`;
    if (remarks) {
        url += `/${remarks}`;
    }
    return axiosInstance.put(url).then((response) => {
        return response;
    })
}

const transferTrip = async (tripId, vehicleId) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.TRANSFER}/${tripId}/${vehicleId}`;
    return axiosInstance.put(url).then((response) => {
        return response;
    })
}

const resolveOpsIssue = async(tripId, issueType, remarks) =>{
    let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.RESOLVE_OPS_ISSUE}/${tripId}/${issueType}`;
    if(remarks){
        url += `/${remarks}`;
    }
    return axiosInstance.put(url).then((response)=>{
        return response;
    })
}

const calculateRoutewiseDistance = async (tripId, routeWiseDistance) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.CALCULATE}/${tripId}/${routeWiseDistance}`;
    return axiosInstance.put(url).then((response) => {
        return response;
    })
}

const deleteMember = async (tripId, memberId) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.DELETE_MEMBER}/${tripId}/${memberId}`;
    return axiosInstance.delete(url).then((response) => {
        return response;
    })
}

const createManualTrip = async (body) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.CREATE_MANUAL_TRIP}`;
    return axiosInstance.post(url, body).then((response) => {
        return response;
    })
}

const addMember = async (body) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.ADD_MEMBER}`;
    return axiosInstance.post(url, body).then((response) => {
        return response;
    })
}

const updateTrip = async (body) =>{
    let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.UPDATE_TRIP}`;
    return axiosInstance.post(url, body).then((response)=>{
        return response;
    })
}

const billingOpsIssueSearchByBean = async(queryParams, searchValues) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.OPS_ISSUE}${API_PATH.SEARCH_BY_BEAN}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.post(url, searchValues).then((response) => {
        return response;
    });
}

const billingIssuesSearchByBean = async (queryParams, searchValues) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.BILLING_ISSUE}${API_PATH.SEARCH_BY_BEAN}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.post(url, searchValues).then((response) => {
        return response;
    });
}

const auditApproval = async(tripId,flag) =>{
    let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.AUDIT_APPROVAL}/${tripId}/${flag}`;
    return axiosInstance.post(url).then((response)=>{
        return response;
    })
}

const billingAuditSearchByBean = async(queryParams, state, searchValues) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.AUDIT}${API_PATH.SEARCH_BY_BEAN}/${state}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.post(url, searchValues).then((response) => {
        return response;
    });
}

const billingTripMember = async (tripId) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.TRIP_MEMBERS}?tripId=${tripId}`;
    return axiosInstance.get(url).then((response) => {
        return response;
    })
}

const getTripHistory = async(tripId) =>{
    let url = `${API_PATH.API_VERSION}${API_PATH.TRIP}${API_PATH.TRIP_HISTORY}/${tripId}`;
    return axiosInstance.get(url).then((response)=>{
        return response;
    });
}

const markNoShow = async(tripId, id, flag) =>{
    let url = `${API_PATH.API_VERSION}${API_PATH.BILLING}${API_PATH.MARK_NO_SHOW}/${tripId}/${id}/${flag}`;
    return axiosInstance.put(url).then((response)=>{
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
    markNoShow
}

export default BillingService;