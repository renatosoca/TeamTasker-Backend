import { Document, ObjectId } from 'mongoose';
import { User } from './user.interface';

export interface Project extends Document {
  _id: ObjectId | string;
  name: string;
  description: string,
  type: string;
  owner: User;
  boards: ( ObjectId | string )[];
  collaborators: ( User )[];
}