import {get} from "../api_functions.js";
import {PIXELBOARD} from "../url_functions.js";

export const getPixelsByPixelBoardId = async (pixelBoardId) => {
    return get(`${PIXELBOARD}/${pixelBoardId}/pixels`, pixelBoardId).then(res => {
        return res.data;
    });
}