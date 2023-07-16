import { User } from 'src/user/entities/user.entity';
import { ProjectOwner } from '../types';

export const mapToProjectOwner = (user: User): ProjectOwner => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  roles: user.roles,
});
