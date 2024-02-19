import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";
import {BusinessError} from "../error/business.error.js";

export const userService = {

    generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' });
    },

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

        const accessToken = this.generateAccessToken(user);

        return {user, accessToken};
    }
}