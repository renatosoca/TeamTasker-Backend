import { Schema, model } from 'mongoose';
import { Task } from '../interfaces';

const taskSchema = new Schema<Task>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in-progress', 'completed'],
  },
  deliveryDate: {
    type: Date,
    default: Date.now(),
  },
  priority: {
    type: String,
    default: 'low',
    enum: ['low', 'medium', 'high'],
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
}, { timestamps: true, versionKey: false });

export default model<Task>( 'Task', taskSchema );