import prisma from "../prisma/client.js";
import {catchError} from "../error/error-handler.js";
import {userService} from "../services/user.service.js";
import {BusinessError} from "../error/business.error.js";
import bcrypt from "bcrypt";

export const helloWorld = async (req, res, next) => {
    await catchError(async () => {
        res.send(await prisma.user.findMany(
            {
                include: {
                    role: true
                }
            }
        ));
    }, next)
}

export const login = async (req, res, next) => {
    await catchError(async () => {
        const {email, password} = req.body;

        if (!email || !password) {
            throw BusinessError(400, 'Bad request', 'Missing email or password');
        }

        const info = await userService.login(email, password);

        res.json(info);
    }, next)
}

export const updateUser = async (req, res, next) => {
    await catchError(async () => {
        const {username, email, password} = req.body;
        const updatedUser = await userService.updateUser(username, email, password);
        res.json(updatedUser);
    }, next);
};

export const changePassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'Missing userId or newPassword' });
        }
        const updatedUser = await userService.updateUserPassword( newPassword);
        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};



