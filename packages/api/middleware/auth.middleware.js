import jwt from "jsonwebtoken";
import {TechnicalError} from "../error/technical.error.js";

export const authMiddleware = {
    authenticatedUser(req, res, next) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, process.env.ACCESS_API_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }

                req.user = user;
                next();
            });
        } else {
            throw new TechnicalError(401, 'Unauthorized', 'You are not connected to the API server');
        }
    },

    authenticatedAdmin(req, res, next) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, process.env.ACCESS_API_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }

                if (user.roleId === 'ROLE_ADMIN') {
                    req.user = user;
                    next();
                } else {
                    throw new BusinessError(403, 'Forbidden', 'You are not authorized to access this resource');
                }
            });
        } else {
            throw new TechnicalError(401, 'Unauthorized', 'You are not connected to the API server');
        }
    },

    authenticatedSocketServer(req, res, next) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, process.env.ACCESS_API_TOKEN_SECRET, (err, result) => {
                if (err) {
                    return res.sendStatus(403);
                }

                next();
            });
        } else {
            throw new TechnicalError(401, 'Unauthorized', 'You are not connected to the socket server')
        }
    }
};