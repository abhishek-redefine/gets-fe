import axios from "axios";

const calculateDistance = async (coordA, coordB) => {
    const baseURL = process.env.NEXT_PUBLIC_SOCKET_IO_URL;
    return axios.post(`${baseURL}/distance`, { coordA: coordA, coordB: coordB }).then((response) => {
        const data = response.data;
        return data;
    })
}

const GoogleService = {
    calculateDistance
};

export default GoogleService;