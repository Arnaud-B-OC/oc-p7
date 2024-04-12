import mongoose, { Schema } from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator);

export const User = mongoose.model('User', UserSchema);
