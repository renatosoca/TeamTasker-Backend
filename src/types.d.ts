import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  lastname: string,
  email: string;
  password: string;
  token: string;
  confirmed: boolean;
  comparePassword: ( password: string) => boolean;
}