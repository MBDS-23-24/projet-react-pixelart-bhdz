import express from "express";
import {helloWorld, login} from "../controllers/user.controller.js";

const router = express.Router()

router.get('/', helloWorld)
router.post('/login', login)

export default router