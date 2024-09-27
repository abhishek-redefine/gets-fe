import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "../utils/axios";

const getAlertCountOverspeed = async(alertDate, type) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.OVERSPEED}${API_PATH.COUNT}/${alertDate}/${type}`).then((response) =>{
        return response;
    })
}

const getAlertCountSOS = async(alertDate,type) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.ALERT}${API_PATH.COUNT}/${alertDate}/${type}`).then((response) =>{
        return response;
    })
}

const getOverSpeedTripList = async(alertDate, type) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.OVERSPEED}${API_PATH.TRIP}/${alertDate}/${type}`).then((response)=>{
        return response;
    })
}

const getAlertTripList = async(alertDate,type) =>{
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.ALERT}${API_PATH.TRIP}/${alertDate}/${type}`).then((response) =>{
        return response;
    })
}

const TrackingService = {
    getAlertCountSOS,
    getAlertCountOverspeed,
    getOverSpeedTripList,
    getAlertTripList
}

export default TrackingService;