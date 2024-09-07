import { STATUS_CODES } from '../constants';

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CODES.ERROR_CODE;
  }
}

export default BadRequestError;
