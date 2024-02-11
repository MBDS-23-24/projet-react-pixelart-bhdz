import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";
import {BusinessError} from "../error/business.error.js";

export const userService = {

    generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' });
    },

    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: {email: email},
        });

        if (!user) {
            return new BusinessError(401, 'Invalid email', 'Email not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return new BusinessError(401, 'Invalid password');
        }

        const accessToken = this.generateAccessToken(user);

        return {user, accessToken};
    }
}