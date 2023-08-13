import { UserRole } from 'src/user/types/enum.user-role';

export enum StatusProject {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  SUSPEND = 'suspend',
  RESUME = 'resume',
  ALL = 'all-projects',
}

export type MemberProject = {
  id: number;
  firstName: string;
  lastName: string;
  photo: string | null;
  phone: string;
  email: string;
  projectRole: string;
};

export type ProjectOwner = Omit<MemberProject, 'projectRole'>;

export type ProjectPublic = {
  id: number;

  status: StatusProject;

  title: string;

  description: string;

  owner: ProjectOwner;

  members: MemberProject[];
};

export type UserRoleToProfile = {
  id: number;
  projectId: number;
  role: UserRole;
};
