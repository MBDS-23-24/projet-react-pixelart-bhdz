import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";
import {BusinessError} from "../error/business.error.js";
import {jwtService} from "./jwt.service.js";

export const userService = {

    async login(email, password) {
        const errorCredentials = new BusinessError(401, 'Credentials incorrects ! Please try again');
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

    async getUsernameByListUserId(listUserId) {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: listUserId
                }
            },
            select: {
                id: true,
                username: true
            }
        });

        const usersMap = new Map();
        for (const user of users) {
            usersMap.set(user.id, user);
        }

        return usersMap;
    },
}