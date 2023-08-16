import { Member } from 'src/user/entities/member.entity';
import { MemberRole } from 'src/user/types/enum.user-role';

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
  photo: string | null;
  phone: string;
  email: string;
};

export type UserToProfile = ProjectOwner

export type ProjectMember = ProjectOwner & {
  role: MemberRole;
};

export type ProjectPublic = {
  id: number;
  status: StatusProject;
  title: string;
  description: string;
  owner: ProjectOwner;
  members: ProjectMember[];
};
