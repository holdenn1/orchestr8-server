import { User } from 'src/user/entities/user.entity';
import { MemberProject } from '../types';

export const mapToProjectMember = (members: User[]): MemberProject[] =>
  members.map((member) => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    phone: member.phone,
    email: member.email,
    roles: member.roles,
  }));
