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

    async getUsernameUser(userId) {
        return prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                username: true
                // TODO : ajouter l'avatar de l'utilisateur
            }
        });
    },
}