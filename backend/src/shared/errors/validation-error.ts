import { BadRequestError } from "./bad-request-error.js";

export class ValidationError extends BadRequestError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR");
  }
}