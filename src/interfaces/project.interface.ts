import { Document, ObjectId } from 'mongoose';
import { User } from './user.interface';

export interface Project extends Document {
  _id: ObjectId | string;
  name: string;
  description: string,
  creationDate: Date;
  client: string;
  owner: ObjectId | User;
  colaborators: ( ObjectId | User )[];
}