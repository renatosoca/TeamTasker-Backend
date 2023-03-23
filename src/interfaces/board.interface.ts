import { ObjectId } from "mongoose";

export interface Board extends Document {
  _id: ObjectId | string;
  title: string;
  background: string;
  project: ObjectId | string;
  tasks: (ObjectId | string)[];
}