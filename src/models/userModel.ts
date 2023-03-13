import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { generateToken } from '../helpers/generateToken';
import { User } from '../types';

const userModel = new Schema<User>({
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
}, { timestamps: true });

userModel.pre('save', function ( this: User, next ) {
  if ( !this.isModified( 'password ') ) return next();

  const salt = bcrypt.genSaltSync( 10 );
  this.password = bcrypt.hashSync( this.password, salt );
  next();
})

userModel.methods.comparePassword = function ( this: User, password: string ) {
  return bcrypt.compareSync( password, this.password );
}

export default model<User>( 'User', userModel );