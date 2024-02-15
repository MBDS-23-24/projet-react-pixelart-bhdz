import express from "express";
import {helloWorld,login} from "../controllers/user.controller.js";

const router = express.Router()

router.get('/', helloWorld)

export default router