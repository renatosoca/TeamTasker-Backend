import { Schema, model } from 'mongoose';
import { generateToken } from '../helpers';
import { User } from '../interfaces';

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    default: generateToken(),
  },
  confirmed: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true, versionKey: false });

export default model<User>( 'User', userSchema );