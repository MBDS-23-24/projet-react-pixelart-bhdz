import express from "express";
import {
    checkToken,
    changePassword,
    updateUser, getContributedPixelBoardByUserId, contributors
} from "../controllers/user.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router()
router.put('/update', authMiddleware.authenticatedUser, updateUser)
router.put('/change-password', authMiddleware.authenticatedUser, changePassword)
router.get('/check-token', authMiddleware.authenticatedUser, checkToken)
router.get('/:userId/contribution/pixelboards', authMiddleware.authenticatedUser, getContributedPixelBoardByUserId)
router.get('/contributors', authMiddleware.authenticatedUser, contributors)

export default router