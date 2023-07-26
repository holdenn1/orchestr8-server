import { Project } from 'src/project/entities/project.entity';
import { UserRole } from '../../user/types/enum.user-role';

export type JwtPayload = {
  sub: number;
  email: string;
  roles: UserRole[];
};

export type UserRequest = JwtPayload & {
  refreshToken?: string;
  [key: string]: any;
};

export type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  photo: string;
  phone: string;
  email: string;
  roles: UserRole[];
  memberProjects: Project[];
};
