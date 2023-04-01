import { ObjectId } from "mongoose";
import { Project } from "./project.interface";

export interface Board extends Document {
  _id: ObjectId | string;
  title: string;
  background: string;
  project: Project;
  tasks: (ObjectId | string)[];
}