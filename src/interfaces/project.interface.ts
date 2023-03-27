import { Document, ObjectId } from 'mongoose';

export interface Project extends Document {
  _id: ObjectId | string;
  name: string;
  description: string,
  type: string;
  owner: ObjectId | string;
  boards: ( ObjectId | string )[];
  collaborators: ( ObjectId | string )[];
}