import express from "express";
import {pixelBoardController} from "../controllers/pixel-board.controller.js";
import {authenticateJWT} from "../middleware/Middleware.js";

const router = express.Router()

router.post('/:pixelBoardId/pixels', pixelBoardController.postPixels)
router.get('/:pixelBoardId/pixels', authenticateJWT, pixelBoardController.getPixels)
router.get('/:pixelBoardId', pixelBoardController.getPixelBoard)

export default router