const API_URL = process.env.VITE_EXPRESS_URL;

const ApiService = {

    async postPixels(pixelBoardId, pixelsList) {
        return "TODO: Implement me!"
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