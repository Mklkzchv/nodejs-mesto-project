import { StatusCodes } from './http-status-codes';

class ConflictError extends Error {
  private statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.message = message;
  }
}

export default ConflictError;
