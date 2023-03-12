import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { generateToken } from '../helpers';

const userSchema = new Schema({
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

userSchema.pre('save', function( next ) {
  if ( !this.isModified('password') ) return next();

  const salt = bcrypt.genSaltSync( 10 );
  this.password = bcrypt.hashSync( this.password, salt );
});

userSchema.methods.comparePassword = function( password ) {
  return bcrypt.compareSync(password, this.password);
}

export default model('User', userSchema);