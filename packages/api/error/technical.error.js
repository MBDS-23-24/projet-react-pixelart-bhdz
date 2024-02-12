import {AppError} from "./app.error.js";

export class TechnicalError extends AppError {
    type = 'Technical'
    constructor(code, message, details) {
        super(code, message, details)
        this.name = 'TechnicalError'
    }
}