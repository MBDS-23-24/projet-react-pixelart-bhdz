import jwt from "jsonwebtoken";
import {catchError} from "../error/error-handler.js";
import {BusinessError} from "../error/business.error.js";

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

export const checkAuhtorization = async (req, res, next) =>{
    await catchError((req) => {
        const user = req.user
        if (!user && user.role.toUpperCase !== "ROLE_ADMIN") {
            throw BusinessError(403, "Not Authorization", "You do not have permission to navigate here")
        }
    }, next)
}