import {get, post, del, put} from "../api_functions.js";
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

export const getHistoryPixelsByBoardId = async (pixelBoardId) => {
    return get(`${PIXELBOARD}/${pixelBoardId}/history`).then(res => {
        return res.data;
    });
}

export const getPixelBoardsByCreator = async (creatorId) => {
    console.log(creatorId)
    return get(`${PIXELBOARD}/${creatorId}/creator`).then(res => res.data);
}

export const delelePixelBoard = async (pixelId) => {
    return del(`${PIXELBOARD}/${pixelId}`)
}

export const addPixelBoard = async (pixelBoardToAdd) => {
    const pixelBoard = {
        pixelBoard: pixelBoardToAdd
    }
    return post(`${PIXELBOARD}/create`, pixelBoard)
}

export const getAllPixelBoards = async () => {
    return get(`${PIXELBOARD}/pixels`);
}

export const updatePixelBoard = async (pixelBoardId, pixelBoardToUpdate) => {
    const pixelBoard = {
    pixelBoard: pixelBoardToUpdate
}
    return put(`${PIXELBOARD}/${pixelBoardId}/update`, pixelBoard)
}