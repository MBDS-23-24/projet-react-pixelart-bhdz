import {catchError} from "../error/error-handler.js";
import {userService} from "../services/user.service.js";
import {BusinessError} from "../error/business.error.js";

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

        delete info.user.password;
        info.user.accessToken = info.accessToken;
        res.json(info.user);
    }, next)
}

export const updateUserAccount = async (req, res, next) => {
    await catchError(async () => {
        const {username, email, accountImageUrl} = req.body;
        if (!username || !email) {
            throw new BusinessError(400, 'Bad request', 'Missing username or email');
        }
        const updatedUser = await userService.updateUserAccount(req.user, username, email, accountImageUrl);
        res.json(updatedUser);
    }, next);
};

export const updateUser = async (req, res, next) => {
    await catchError(async () => {
        const {username, email, accountImageUrl, role} = req.body;
        if (!username || !email) {
            throw new BusinessError(400, 'Bad request', 'Missing username or email');
        }
        const updatedUser = await userService.updateUser(username, email, accountImageUrl, role);
        res.json(updatedUser);
    }, next);
};

export const changePassword = async (req, res, next) => {
    await catchError(async () => {
            const {newPassword} = req.body;
            if (!newPassword) {
                throw new BusinessError(400, 'Bad request', 'Missing new password');
            }
            const updatedUser = await userService.updateUserPassword(req.user.id, newPassword);
            if (!updatedUser) {
                throw new BusinessError(404, 'Not found', 'User not found');
            }
            return res.status(200).json(updatedUser);
        }
        , next);
}

export const registerUser = async (req, res, next) => {
    await catchError(async () => {
        const {username, email, password,accountImageUrl} = req.body;
        if (!username || !email || !password) {
            throw new BusinessError(400, 'Bad request', 'Missing username, email or password');
        }
        const user = await userService.registerUser(username, email, password, accountImageUrl);
        res.json(user);
    }, next);

}

export const getAllUsers = async (req, res, next) => {
    await catchError(async () => {
        const users = await userService.getAllUsers();
        res.json(users);
    }, next);
}

export const getNumberOfRegisteredUsers = async (req, res, next) => {
    await catchError(async () => {
        const numberOfUsers = await userService.getNumberOfRegisteredUsers();
        res.json(numberOfUsers);
    }, next);
}

export const getAllRoles = async (req, res, next) => {
    await catchError(async () => {
        const roles = await userService.getAllRoles();
        res.json(roles);
    }, next);
}