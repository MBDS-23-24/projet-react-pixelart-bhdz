import {get} from "../api_functions.js";
import {PIXELBOARD} from "../url_functions.js";

export const getPixelsByPixelBoardId = async (pixelBoardId) => {
    return get(`${PIXELBOARD}/${pixelBoardId}/pixels`).then(res => {
        return res.data;
    });
}

export const getPixelBoardById = async (pixelBoardId) => {
    return get(`${PIXELBOARD}/${pixelBoardId}`).then(res => {
        return res.data;
    });
}

export const getAllPixelBoards = async () => {
    return get(`${PIXELBOARD}`).then(res => res.data)
}

export const getHistoryPixelsByBoardId = async (pixelBoardId) => {
    return get(`${PIXELBOARD}/${pixelBoardId}/history`).then(res => {
        return res.data;
    });
}