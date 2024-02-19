import express from "express";
import {pixelBoardController} from "../controllers/pixel-board.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router()

router.post('/:pixelBoardId/pixels',authMiddleware.authenticatedSocketServer, pixelBoardController.postPixels)
router.get('/:pixelBoardId/pixels', authMiddleware.authenticatedUser, pixelBoardController.getPixels)
router.get('/:pixelBoardId', authMiddleware.authenticatedUser, pixelBoardController.getPixelBoard)

export default router