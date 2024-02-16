const API_URL = process.env.VITE_EXPRESS_URL;

const ApiService = {

    async getUserIdByRequest(request) {
        const response = await fetch(API_URL+'/check-token', {
            method: 'GET',
            headers: {
                'Authorization': request.headers.get('Authorization'),
            },
        });
        const data = await response.json();
        return data;
    },

    async postPixels(pixelBoardId, pixelsList) {
        const response = await fetch(API_URL+`/pixel-board/${pixelBoardId}/pixels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pixelsList),
        });
        return response;
    }


}

export default ApiService;