import { User } from 'src/user/entities/user.entity';
import { MemberProject, ProjectOwner, ProjectPublick } from '../types';
import { Project } from '../entities/project.entity';

export const mapToProjectMembers = (members: User[]): MemberProject[] =>
  members.map((member) => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    phone: member.phone,
    email: member.email,
    roles: member.roles,
  }));

export const mapToProjectOwner = (user: User): ProjectOwner => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  roles: user.roles,
});

export const mapToProject = (project: Project): ProjectPublick => ({
  id: project.id,
  status: project.status,
  titleProject: project.titleProject,
  descriptionProject: project.descriptionProject,
  tasks: project.tasks,
  owner: project.owner,
  members: project.members,
});