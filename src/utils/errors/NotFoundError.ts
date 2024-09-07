import { STATUS_CODES } from '../constants';

class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CODES.NOT_FOUND;
  }
}

export default NotFoundError;
