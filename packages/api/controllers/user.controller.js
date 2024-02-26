import prisma from "../prisma/client.js";
import {catchError} from "../error/error-handler.js";
import {userService} from "../services/user.service.js";
import {BusinessError} from "../error/business.error.js";

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

export const checkToken = async (req, res, next) => {
    await catchError(async () => {
        if(req.user){
            res.send(req.user);
        }else{
            throw BusinessError(401, 'Unauthorized', 'You are not connected')
        }
    }, next)
}

export const login = async (req, res, next) => {
    await catchError(async () => {
        const {email, password} = req.body;

        if (!email || !password) {
            throw BusinessError(400, 'Bad request', 'Missing email or password');
        }

        const info = await userService.login(email, password);

        res.cookie('accessToken', info.accessToken, {maxAge: 24 * 60 * 60 * 1000});

        res.json(info.user);
    }, next)
}

export const updateUser = async (req, res, next) => {
    await catchError(async () => {
        const {username, email, password} = req.body;
        const updatedUser = await userService.updateUser(req.user, username, email, password);
        res.json(updatedUser);
    }, next);
};

export const changePassword = async (req, res, next) => {
    try {
        const {newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'Missing newPassword' });
        }
        const updatedUser = await userService.updateUserPassword(req.user.id,newPassword);
        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};



