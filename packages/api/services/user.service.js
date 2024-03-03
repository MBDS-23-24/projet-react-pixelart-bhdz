import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";
import {BusinessError} from "../error/business.error.js";
import {jwtService} from "./jwt.service.js";

export const userService = {

    async login(email, password) {
        const errorCredentials = new BusinessError(401, 'Credentials incorrect ! Please try again');
        const user = await prisma.user.findUnique({
            where: {email: email},
        });

        if (!user) {
            throw errorCredentials;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw errorCredentials;
        }

        const accessToken = jwtService.generateUserAccessToken(user);

        return {user, accessToken};
    },

    async updateUser(user,username, email, accountImageUrl) {
        return prisma.user.update({
            where: {email: user.email},
            data: {
                username: username,
                email: email,
                accountImageUrl: accountImageUrl
            },
        });
    },
    updateUserPassword: async (userId, newPassword) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {password: hash},
        });
        return !!updatedUser;
    },

    async getUsernameByListUserId(listUserId) {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: listUserId
                }
            },
            select: {
                id: true,
                username: true,
                accountImageUrl: true
            }
        });

        const usersMap = new Map();
        for (const user of users) {
            usersMap.set(user.id, user);
        }

        return usersMap;
    },
}
   
