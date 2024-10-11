import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "../utils/axios";

const CreateContract = async (body) => {
  ///api/v1/contract/create
  return axiosInstance
    .post(`${API_PATH.API_VERSION}${API_PATH.CONTRACT}${API_PATH.CREATE}`, body)
    .then((response) => {
      return response;
    });
};

const GetAllContract = async (queryParams) => {
  ///api/v1/contract/all
  let url = `${API_PATH.API_VERSION}${API_PATH.CONTRACT}${API_PATH.ALL}`;
  if (queryParams) {
    url += `?${queryParams}`;
  }
  return axiosInstance.post(url).then((response) => {
    return response;
  });
};

const UpdateContract = async (id, body) => {
  ///api/v1/contract/updateContract/{id}
  ///api/v1/contract/updateContract/1
  return axiosInstance
    .put(
      `${API_PATH.API_VERSION}${API_PATH.CONTRACT}${API_PATH.UPDATE_CONTRACT}/${id}`,
      body
    )
    .then((response) => {
      return response;
    });
};

const ContractService = {
  CreateContract,
  GetAllContract,
  UpdateContract,
};

export default ContractService;
