import { UserRole } from 'src/user/types/enum.user-role';
import { Project } from '../entities/project.entity';

export enum StatusProject {
  COMPLETED = 'Completed',
  IN_PROGRESS = 'In Progress',
  SUSPEND = 'Suspend',
  RESUME = 'Resume',
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

export type ProjectPublick = Omit<Project, 'createAt' | 'updateAt'>;
