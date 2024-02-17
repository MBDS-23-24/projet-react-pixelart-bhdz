import axios from "axios";

const API_URL = process.env.VITE_EXPRESS_URL;

const ApiService = {
    async getUserIdByToken(token) {
        try {
            const response = await axios.get(API_URL + '/user/check-token', {
                headers: {
                    'Authorization': token,
                },
            });
            return response.data.id;
        } catch (error) {
            //console.error('Error while fetching user ID:', error);
            throw error;
        }
    },


    async postPixels(pixelBoardId, pixelsList) {
        try {
            const response = await axios.post(API_URL + `/pixel-board/${pixelBoardId}/pixels`, pixelsList, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default ApiService;
