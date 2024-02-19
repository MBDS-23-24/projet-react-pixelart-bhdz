import {catchError} from "../error/error-handler.js";
import {BusinessError} from "../error/business.error.js";
import pixelBoardService from "../services/pixel-board.service.js";

export const pixelBoardController = {
    async postPixels(req, res, next) {
        await catchError(async () => {
            const pixelBoardId = req?.params?.pixelBoardId;
            const body = req?.body;
            if (!pixelBoardId) {
                throw BusinessError(400, 'Bad request', 'Missing pixel board id');
            }
            if (!body || body.length === 0) {
                throw BusinessError(400, 'Bad request', 'Missing pixels');
            }

            res.send(await pixelBoardService.insertPixels(pixelBoardId, body))
        }, next)
    },

    async getPixels(req, res, next) {
        await catchError(async () => {
            const pixelBoardId = req?.params?.pixelBoardId;
            if (!pixelBoardId) {
                throw BusinessError(400, 'Bad request', 'Missing pixel board id');
            }

            res.send(await pixelBoardService.getPixels(pixelBoardId))
        }, next)
    },

    async getPixelBoard(req, res, next) {
        await catchError(async () => {
            const pixelBoardId = req?.params?.pixelBoardId;
            if (!pixelBoardId) {
                throw BusinessError(400, 'Bad request', 'Missing pixel board id');
            }

            res.send(await pixelBoardService.getPixelBoardById(pixelBoardId))
        }, next)
    }
}