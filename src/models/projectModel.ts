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
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  client : {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  colaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }]
}, { timestamps: true, versionKey: false });

export default model<Project>( 'Project', projectSchema );