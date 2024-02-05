export class AppError extends Error {
    errorType = 'AppError'
    details;
    code;
    message;

    constructor(code, message, details =null) {
        super()
        this.code = code
        this.details = details
        this.message = message
    }
}