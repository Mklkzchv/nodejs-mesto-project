import { STATUS_CODES } from '../constants';

class ConflictError extends Error {
  statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODES.CONFLICT_ERROR;
  }
}

export default ConflictError;
