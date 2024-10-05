import { StatusCodes } from './http-status-codes';

class ForbiddenError extends Error {
  private statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.message = message;
  }
}

export default ForbiddenError;
