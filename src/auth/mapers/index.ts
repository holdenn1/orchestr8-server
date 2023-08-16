import { User } from 'src/user/entities/user.entity';
import { UserProfile } from '../types';

export const mapToUserProfile = (user: User): UserProfile => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  photo: user.photo,
  email: user.email,
  phone: user.phone,
  member: user.member ?? [],
});
