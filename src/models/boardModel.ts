import { Schema, model } from 'mongoose';
import { Board } from '../interfaces';

const boardModel = new Schema<Board>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  background: {
    type: String,
    trim: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }]
}, { timestamps: true, versionKey: false });

export default model<Board>( 'Board', boardModel );