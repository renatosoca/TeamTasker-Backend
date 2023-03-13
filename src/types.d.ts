import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface Auth {
  email: string;
  password: string;
}
export interface User extends Auth {
  _id: ObjectId | string,
  name: string;
  lastname: string,
  token: string;
  confirmed: boolean;
}


export interface UserRequest extends Request {
  user?: User;
}

export interface AuthRequest extends Request {
  user: Pick<User, '_id' | 'name' | 'lastname' | 'email'>;
}

export interface MessageResponse {
  ok: boolean;
  msg?: string
}

export interface AuthResponse extends MessageResponse {
  _id: ObjectId;
  name: string;
  lastname: string;
  email: string;
  jwt?: string;
}