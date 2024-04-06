import axios from "axios";

const API_URL = process.env.VITE_EXPRESS_URL_FOR_SOCKET;

const ApiService = {
    async getUserByToken(userToken) {
        try {
            const response = await axios.get(API_URL + '/user/check-token', {
                headers: {
                    'Authorization': userToken,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    async postPixels(pixelBoardId, pixelsList) {
        try {
            const response = await axios.post(API_URL + `/pixel-board/${pixelBoardId}/pixels`, pixelsList, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + process.env.SOCKET_API_ACCESS_TOKEN,
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default ApiService;
