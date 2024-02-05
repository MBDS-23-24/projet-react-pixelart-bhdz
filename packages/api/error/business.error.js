import {AppError} from "./app.error.js";

export class BusinessError extends AppError {
  type = 'Business';
  constructor(code, message, details) {
    super(code, message, details);
  }
}