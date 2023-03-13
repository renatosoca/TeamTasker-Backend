import { Request } from 'express';
import { Document, ObjectId } from 'mongoose';

export interface User extends Document {
  _id: ObjectId,
  name: string;
  lastname: string,
  email: string;
  password: string;
  token: string;
  confirmed: boolean;
  comparePassword: ( password: string) => boolean;
}

export interface jwtPayload {
  _id: ObjectId;
  name: string;
}

export interface AuthRequestJwt extends Request {
  user?: User;
}

export interface AuthRequest extends Request {
  user: Pick<User, '_id' | 'name' | 'lastname' | 'email'>;
}

