import mongoose, { Schema } from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

interface IUser extends mongoose.Document {
    email: string
    password: string
}

const UserSchema : Schema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator);

export const User = mongoose.model<IUser>('User', UserSchema);
export type UserType = (mongoose.Document<unknown, {}, IUser> & IUser & { _id: mongoose.Types.ObjectId });
