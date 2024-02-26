import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";
import {BusinessError} from "../error/business.error.js";
import {jwtService} from "./jwt.service.js";

export const userService = {

    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: {email: email},
        });

        if (!user) {
            throw new BusinessError(401, 'Invalid email', 'Email not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new BusinessError(401, 'Invalid password');
        }

        const accessToken = jwtService.generateUserAccessToken(user);

        return {user, accessToken};
    },

    async updateUser(user,username, email, password) {
        return await prisma.user.update({
            where: {email: user.email},
            data: {
                username: username,
                email: email
            },
        });
    },
    updateUserPassword: async (userId, newPassword) => {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newPassword, salt, async function (err, hash) {
                const updatedUser = await prisma.user.update({
                    where: {id: userId},
                    data: {password: hash},
                });
            });
        });
        return true;
    }
}
