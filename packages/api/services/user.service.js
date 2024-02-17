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
            throw new BusinessError(401, 'Invalid email', 'Email not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new BusinessError(401, 'Invalid password');
        }

        const accessToken = this.generateAccessToken(user);

        return {user, accessToken};
    },

    async updateUser(username, email, password) {
        return await prisma.user.update({
            where: {email: email},
            data: {
                username: username,
                email: email
            },
        });
    },
    updateUserPassword: async (userId, newPassword) => {
        //const salt = await bcrypt.genSalt(10);

       // const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { password: newPassword },
        });
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
}
