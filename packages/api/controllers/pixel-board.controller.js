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
    },

    async getPixelBoardsByCreator(req, res, next){
        console.log("requete received from client")
        const creatorId = req.params.creatorId;
        console.log(creatorId)
        if (!creatorId){
            throw BusinessError(400, "Bad request", "Missing creator id")
        }
        await catchError(async () => res.send(await pixelBoardService.getPixelBordsByCreator(creatorId)), next)
    },

    async getHistoryPixelsByBoardId(req, res, next) {
        await catchError(async () => {
            const pixelBoardId = req?.params?.pixelBoardId;
            if (!pixelBoardId) {
                throw BusinessError(400, 'Bad request', 'Missing pixel board id');
            }

            res.send(await pixelBoardService.getHistoryPixels(pixelBoardId))
        }, next)
    },
  async deletePixelBoard(req, res, next) {
            const pixelBoardId = req?.params?.pixelBoardId;
            if (!pixelBoardId){
                throw BusinessError(400, 'Bad request', "Missing pixel board id")
            }

      await  catchError(async () => res.send(await pixelBoardService.deletePixelBoard(pixelBoardId)), next)
    },
    async createPixelBoard(req, res, next) {
        if (!req.body){
            throw BusinessError(400, 'Bad request', "Missing pixel data")
        }

        const receivedPixel = req?.body?.pixelBoard
        console.log("Received pixel ", receivedPixel)

        await  catchError(async () => res.send(await pixelBoardService.addPixelBoard(receivedPixel)), next)
    },

    async updatePixelBoard(req, res, next) {

        const pixelBoardId = req?.params?.pixelBoardId;

        if (!pixelBoardId){
            throw BusinessError(400, 'Bad request', "Missing pixel board id")
        }

        if (!req.body){
            throw BusinessError(400, 'Bad request', "Missing pixel data")
        }

        const receivedPixel = req?.body?.pixelBoard
        console.log("Received pixel ", receivedPixel)

        await  catchError(async () => res.send(await pixelBoardService.updatePixelBoard(pixelBoardId, receivedPixel)), next)
    },

    async getAllPixelBoards (req, res, next){
        await  catchError(async () => res.send(await pixelBoardService.getAllPixelBoards()), next)
}
}