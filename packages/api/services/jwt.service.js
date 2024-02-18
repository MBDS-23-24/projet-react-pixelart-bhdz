import jwt from "jsonwebtoken";

export const jwtService = {
    generateUserAccessToken(user) {
        return jwt.sign(user, process.env.USER_ACCESS_API_TOKEN_SECRET, {expiresIn: '12h'});
    }
}