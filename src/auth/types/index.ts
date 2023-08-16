import { Member } from 'src/user/entities/member.entity';

export type JwtPayload = {
  sub: number;
  email: string;
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
  member: Member[];
};
