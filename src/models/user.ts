import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

interface IUser {
    name: string;
    about: string;
    avatar: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },
    about: {
        type: String,
        minlength: 2,
        maxlength: 200,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    email: {
        type: String,
        minlength: 2,
        maxlength: 30,
        validate: { validator(s: string) { return isEmail(s) }, message: 'invalid email' },
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },
});
export default mongoose.model<IUser>('user', userSchema); 