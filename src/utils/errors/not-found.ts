import { StatusCodes } from './http-status-codes';

class NotFoundError extends Error {
  private statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.message = message;
  }
}

export default NotFoundError;
