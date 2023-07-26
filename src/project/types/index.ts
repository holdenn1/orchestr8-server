import { UserRole } from 'src/user/types/enum.user-role';
import { Task } from '../entities/task.entity';

export enum StatusProject {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  SUSPEND = 'suspend',
  RESUME = 'resume',
  ALL = 'all-projects',
}

export type ProjectOwner = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roles: UserRole[];
};

export type MemberProject = ProjectOwner;

export type ProjectPublick = {
  id: number;

  status: StatusProject;

  title: string;

  description: string;

  owner: ProjectOwner;

  members: MemberProject[];

  tasks: Task[];
};


