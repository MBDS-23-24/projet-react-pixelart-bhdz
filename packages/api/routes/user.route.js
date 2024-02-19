import express from "express";
import {checkToken, helloWorld, login} from "../controllers/user.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router()

router.get('/', helloWorld)
router.get('/check-token', authMiddleware.authenticatedUser, checkToken)

export default router