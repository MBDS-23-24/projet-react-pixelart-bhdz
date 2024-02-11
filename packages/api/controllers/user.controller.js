import prisma from "../prisma/client.js";
import {catchError} from "../error/error-handler.js";

export const helloWorld = async (req, res, next) => {
    await catchError(async () => {
        res.send('Hello World')
    }, next)
}