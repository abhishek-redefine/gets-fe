import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "./../utils/axios";

const getMasterData = (type) => {
    return axiosInstance.get(`${API_PATH.API_VERSION}${API_PATH.MASTER_DATA}${type}`).then((response) => {
        return response;
    });
};

const MasterDataService = {
    getMasterData
};

export default MasterDataService;
