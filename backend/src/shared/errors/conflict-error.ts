import { AppError } from "./app-error.js";

export class ConflictError extends AppError {
  constructor(
    message = "Conflict",
    code = "CONFLICT",
  ) {
    super(message, 409, code);
  }
}