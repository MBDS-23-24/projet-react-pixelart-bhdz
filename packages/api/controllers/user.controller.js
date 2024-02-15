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
// export const updateUser = async (req, res, next) => {
//     await catchError(async () => {
//         const { id, username, email, password } = req.body;
//
//         // Hash the password if it's provided
//         const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
//
//         const updatedUser = await prisma.user.update({
//             where: { id: id },
//             data: {
//                 username: username,
//                 email: email,
//                 ...(hashedPassword && { password: hashedPassword }),
//             },
//         });
//
//         res.json(updatedUser);
//     }, next);
// };


