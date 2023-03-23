import { Schema, model } from 'mongoose';
import { Project } from '../interfaces';

const projectSchema = new Schema<Project>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type : {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  boards: [{
    type: Schema.Types.ObjectId,
    ref: 'Board',
  }],
  colaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true, versionKey: false });

export default model<Project>( 'Project', projectSchema );