import express from "express";
import {pixelBoardController} from "../controllers/pixel-board.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router()

router.get('/:creatorId/creator', authMiddleware.authenticatedUser, pixelBoardController.getPixelBoardsByCreator)
router.delete('/:pixelBoardId', authMiddleware.authenticatedUser, pixelBoardController.deletePixelBoard)
router.put('/', authMiddleware.authenticatedUser, pixelBoardController.updatePixelBoard)
router.post('/create', authMiddleware.authenticatedUser, pixelBoardController.createPixelBoard)
router.get('/pixels',authMiddleware.authenticatedUser, pixelBoardController.getAllPixelBoards)
router.post('/:pixelBoardId/pixels',authMiddleware.authenticatedSocketServer, pixelBoardController.postPixels)
router.get('/:pixelBoardId/pixels', authMiddleware.authenticatedUser, pixelBoardController.getPixels)
router.get('/:pixelBoardId', authMiddleware.authenticatedUser, pixelBoardController.getPixelBoard)
router.get("", pixelBoardController.getAllPixelBoards)
router.get('/:pixelBoardId/history', authMiddleware.authenticatedUser, pixelBoardController.getHistoryPixelsByBoardId)

export default router