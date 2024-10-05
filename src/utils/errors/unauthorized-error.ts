import { StatusCodes } from './http-status-codes';

class UnauthorizedError extends Error {
  private statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.message = message;
  }
}

export default UnauthorizedError;
