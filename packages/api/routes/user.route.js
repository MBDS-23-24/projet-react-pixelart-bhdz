import express from "express";
import {checkToken, helloWorld, login} from "../controllers/user.controller.js";
import {authenticateJWT} from "../middleware/Middleware.js";

const router = express.Router()

router.get('/', helloWorld)
router.get('/check-token', authenticateJWT, checkToken)

export default router