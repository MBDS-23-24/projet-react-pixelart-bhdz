import express from "express";
import {
    checkToken,
    changePassword,
    updateUserAccount,
    getAllUsers,
    getAllRoles,
    updateUser
} from "../controllers/user.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router()
router.put('/updateAccount',authMiddleware.authenticatedUser,updateUserAccount)
router.put('/updateUser',authMiddleware.authenticatedAdmin,updateUser)
router.put('/change-password',authMiddleware.authenticatedUser,changePassword)
router.get('/check-token', authMiddleware.authenticatedUser, checkToken)
router.get('/all', authMiddleware.authenticatedAdmin, getAllUsers)
router.get('/roles', authMiddleware.authenticatedAdmin, getAllRoles)

export default router