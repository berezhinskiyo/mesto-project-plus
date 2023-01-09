import BaseException from './base-err';

class WrongPasswordError extends BaseException {
  constructor(message: string) {
    super(401, message);
  }
}

export default WrongPasswordError;
