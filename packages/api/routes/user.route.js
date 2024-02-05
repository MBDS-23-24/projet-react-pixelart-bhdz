import express from "express";
import {helloWorld} from "../controllers/user.controller.js";

const router = express.Router()

router.get('/', helloWorld)

export default router