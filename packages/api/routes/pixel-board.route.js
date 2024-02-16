import express from "express";
import {pixelBoardController} from "../controllers/pixel-board.controller.js";
import {authenticateJWT} from "../middleware/Middleware.js";

const router = express.Router()

router.post('/:pixelBoardId/pixels', authenticateJWT, pixelBoardController.postPixels)
router.get('/:pixelBoardId/pixels', authenticateJWT, pixelBoardController.getPixels)

export default router