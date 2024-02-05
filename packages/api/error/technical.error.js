import {AppError} from "./app.error.js";

export class TechnicalError extends AppError {
    errorType = 'Technical'
    constructor(code, message, details) {
        super(code, message, details)
        this.name = 'TechnicalError'
    }
}