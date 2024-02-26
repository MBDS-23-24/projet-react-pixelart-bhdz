import jwt from "jsonwebtoken";
import {BusinessError} from "../error/business.error.js";
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