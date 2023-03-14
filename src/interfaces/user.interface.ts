import { Request } from "express";
import { Document, ObjectId } from "mongoose";
import { Auth } from "./";

export interface User extends Document, Auth {
  _id: ObjectId | string,
  name: string;
  lastname: string,
  token: string;
  confirmed: boolean;
}

export interface UserResquestProvider extends Request {
  user?: User;
}