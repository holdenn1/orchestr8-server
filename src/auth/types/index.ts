import { UserRole } from '../../user/types/enum.user-role';

export type LoginJwtPayload = {
  id: string;
  email: string;
  roles: UserRole[];
};
