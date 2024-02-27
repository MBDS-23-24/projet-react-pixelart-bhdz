export class SocketError {
    code
    message
    details

    constructor(code, message, details) {
        this.code = code;
        this.message = message;
        this.details = details
    }
}