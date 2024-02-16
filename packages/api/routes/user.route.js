import express from "express";
import {helloWorld,login, updateUser} from "../controllers/user.controller.js";

const router = express.Router()

router.get('/', helloWorld)
router.put('/update', updateUser)

export default router