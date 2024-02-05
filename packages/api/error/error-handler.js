import {TechnicalError} from "./technical.error.js";

/**
 * Use case sample
 * export const myControllerMethod = async (req, res, next) => {
 *     await catcherError(async () => {
 *         let compute = 1+1
 *         if (compute > 10){
 *          throw new BusinessError(401, 'Invalid compute')
 *         }
 *         res.status(200).json(compute);
 *     }, next)
 *
 * };
 */

export function errorHandler (err, req, res, next) {
    console.error(err.stack)
    try {
        res.status(err.code).send(err)
    }catch (err) {
        res.status(500).send(new TechnicalError(500, "Internal Server Error", "An error occurred" ))
    }
}

export async function catcherError(myFunction, next) {
    try {
        await myFunction();
    }catch (err) {
        next(err);
    }
}