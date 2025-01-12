export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message); // Call the parent class constructor
    this.statusCode = statusCode;
    this.name = this.constructor.name; // Name of the error class
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}
