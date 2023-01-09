import BaseException from './base-err';

class NotUniqueEmailError extends BaseException {
  constructor(message: string) {
    super(409, message);
  }
}

export default NotUniqueEmailError;
