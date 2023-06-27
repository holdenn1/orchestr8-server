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
