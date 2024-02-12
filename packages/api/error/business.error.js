import {AppError} from "./app.error.js";

export class BusinessError extends AppError {
  errorType = 'Business';
  constructor(code, message, details) {
    super(code, message, details);
  }
}