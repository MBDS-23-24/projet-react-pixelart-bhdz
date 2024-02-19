import jwt from "jsonwebtoken";

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
            res.sendStatus(401);
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
            res.sendStatus(401);
        }
    }
};