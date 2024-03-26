import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const getAllBookings = (queryParams, searchValues) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.GET_BOOKINGS}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.post(url, searchValues).then((response) => {
        return response;
    });
};

const getLoginLogoutTimes = (officeId, isIn, transportType) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SHIFT}/${officeId}/${transportType}/${isIn ? API_PATH.IN : API_PATH.OUT}`).then((response) => {
        return response;
    });
};

const getTeamLoginLogoutTimes = (officeId, isIn, transportType,teamId) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.SHIFT}${API_PATH.TEAM}/${officeId}/${transportType}/${isIn ? API_PATH.IN : API_PATH.OUT}?teamId=${teamId}`).then((response) => {
        return response;
    });
};

const getNodalLocations = (officeId) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.NODAL_LOCATIONS}/${officeId}`).then((response) => {
        return response;
    });
};

const getEmployeesByTeamId = (queryParams) => {
    let url = `${API_PATH.API_VERSION}${API_PATH.EMPLOYEES_BY_TEAM}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.get(url).then((response) => {
        return response;
    });
};

const createBooking = (bookingData) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.CREATE_BOOKING}`, bookingData).then((response) => {
        return response;
    });
};

const cancelBooking = (data) => {
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.CANCEL_BOOKING}/${data}`).then((response) => {
        return response;
    });
};

const updateBooking = (bookingData) =>{
    return axiosInstance.put(`${API_PATH.API_VERSION}${API_PATH.UPDATE_BOOKING}/false`,bookingData).then((response) => {
        return response;
    });
}

const getBookingHistory = (queryParams) =>{
    let url = `${API_PATH.API_VERSION}${API_PATH.BOOKING_HISTORY}`;
    if (queryParams) {
        url += `?${queryParams}`;
    }
    return axiosInstance.get(url).then((response) => {
        return response;
    });
}

const uploadForm = (data) => {
    return axiosInstance.post(`${API_PATH.API_VERSION}${API_PATH.FILE_UPLOAD}`, data, {
        headers: {
            "Content-Type":"multipart/form-data"
        }
    }).then((response) => {
        return response;
    });
};

const listAllBookings = () => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.LIST_ALL_BOOKINGS}`).then((response) => {
        return response;
    });
};

const BookingService = {
    getAllBookings,
    getLoginLogoutTimes,
    getNodalLocations,
    getEmployeesByTeamId,
    createBooking,
    cancelBooking,
    updateBooking,
    getBookingHistory,
    uploadForm,
    listAllBookings,
    getTeamLoginLogoutTimes
};

export default BookingService;
