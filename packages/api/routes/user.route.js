import express from "express";
import {helloWorld,login, updateUser} from "../controllers/user.controller.js";
import { changePassword } from '../controllers/user.controller.js';

const router = express.Router()

router.get('/', helloWorld)
router.put('/update', updateUser)
router.post('/change-password', changePassword);

export default router