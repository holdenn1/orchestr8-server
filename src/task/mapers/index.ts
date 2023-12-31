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

export const mapTasksToProfile = (tasks: Task[]): TaskToProfile[] => {
  return tasks.map((task) => ({
    id: task.id,
    completed: task.completed,
    task: task.task,
    createAt: task.updateAt,
    updateAt: task.updateAt,
  }));
};
