import { StatusCodes } from './http-status-codes';

class BadRequestError extends Error {
  private statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.message = message;
  }
}

export default BadRequestError;
