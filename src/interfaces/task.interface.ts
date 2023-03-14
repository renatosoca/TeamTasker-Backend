import { ObjectId } from 'mongoose';
import { Project } from './';

export interface Task extends Document {
  _id: ObjectId | string;
  name: string;
  description: string;
  deliveryDate: Date;
  status: statusTask;
  priority: priorityTask;
  project: Project ;
}

type statusTask = 'pending' | 'in-progress' | 'completed';
type priorityTask = 'low' | 'medium' | 'high';