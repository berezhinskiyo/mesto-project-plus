import BaseException from './base-err';

class ValidationError extends BaseException {
  constructor(message: string) {
    super(400, message);
  }
}

export default ValidationError;
