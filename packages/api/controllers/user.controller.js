import prisma from "../prisma/client.js";
import {catchError} from "../error/error-handler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const helloWorld = async (req, res, next) => {
    await catchError(async () => {
        res.send(await prisma.user.findMany(
            {
                include: {
                    role: true
                }
            }
        ));
    }, next)
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' });
}

export const login = async (req, res, next) => {
    await catchError(async () => {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required'});
        }

        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: {email: email},
        });

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        // Vérifier le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({error: 'Invalid password'});
        }

        // Générer le refresh token
        const accessToken = generateAccessToken(user);

        res.cookie('accessToken', accessToken, {maxAge: 24 * 60 * 60 * 1000});

        res.status(200).json({message: 'User logged in successfully', user});
    }, next)
}