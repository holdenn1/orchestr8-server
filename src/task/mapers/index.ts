import { Task } from '../entities/task.entity';
import { TaskToProfile } from '../types';

export const mapTaskToProfile = ({
  id,
  completed,
  task,
  createAt,
  updateAt,
  ...rest
}: Task): TaskToProfile => ({
  id,
  completed,
  task,
  createAt,
  updateAt,
});
