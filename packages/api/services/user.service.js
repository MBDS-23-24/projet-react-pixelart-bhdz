import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";
import {BusinessError} from "../error/business.error.js";
import {jwtService} from "./jwt.service.js";

export const userService = {

    async contributors() {
        return prisma.user.findMany(
            {
                select: {
                    id: true,
                    username: true
                }
            }
        );
    },

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

    async updateUserAccount(user, username, email, accountImageUrl) {
        return prisma.user.update({
            where: { email: user.email },
            data: {
                username: username,
                email: email,
                accountImageUrl: accountImageUrl
            },
        });
    },

    async updateUser(username, email, accountImageUrl, role) {
        return prisma.user.update({
            where: { email: email },
            data: {
                username: username,
                email: email,
                accountImageUrl: accountImageUrl,
                role: {
                    connect: {
                        id: role.id
                    }
                }
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
    getAllRoles: async () => {
        return prisma.role.findMany();
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

    async getAllUsers() {
        return prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                accountImageUrl: true,
                role: true
            }
        });
    },

    async getContributedPixelBoardByUserId(userId) {
        const result = {
            user: null,
            pixelBoardsContributed: [],
            totalPixel: null
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        delete user.password;


        const pixelBoardsContributed = await prisma.pixelBoard.findMany({
            where: {
                lines: {
                    some: {
                        pixels: {
                            some: {
                                ownerId: userId
                            }
                        }
                    }
                }
            }
        });

        const lines = await prisma.line.findMany({
            where: {
                pixels: {
                    some: {
                        ownerId: userId
                    }
                }
            }
        });

        pixelBoardsContributed.forEach(pixelBoard => {
            const linesForPixelBoard = lines.filter(line => line.pixelBoardId === pixelBoard.id);
            const totalPixelDrawByUserId = linesForPixelBoard.reduce((acc, line) => {
                const totalDrawInLIne = line.pixels.filter(pixel => pixel.ownerId === userId).length;
                return acc + totalDrawInLIne;
            }, 0);
            pixelBoard.totalPixelUser = totalPixelDrawByUserId;
        });

        result.pixelBoardsContributed = pixelBoardsContributed;
        result.totalPixel = pixelBoardsContributed.reduce((acc, pixelBoard) => acc + pixelBoard.totalPixelUser, 0)
        result.user = user;

        return result;
    }
}
   
