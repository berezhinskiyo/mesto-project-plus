import BaseError from './base-err';

class DeleteCardError extends BaseError {
  constructor(message: string) {
    super(403, message);
  }
}
export default DeleteCardError;
