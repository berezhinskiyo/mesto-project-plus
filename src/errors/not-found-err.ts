import BaseException from './base-err';

class NotFoundError extends BaseException {
  constructor(message: string) {
    super(404, message);
  }
}

export default NotFoundError;
