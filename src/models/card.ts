import mongoose, { Schema } from 'mongoose';
import isURL from 'validator/lib/isURL';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: [Schema.Types.ObjectId];
  createdAt: Schema.Types.Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(s: string) {
        return isURL(s, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true });
      },
      message: 'invalid URL',
    },

  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});
export default mongoose.model<ICard>('card', cardSchema);
