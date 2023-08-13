import { User } from 'src/user/entities/user.entity';
import { MemberProject, ProjectOwner, ProjectPublic } from '../types';
import { Project } from '../entities/project.entity';
import { UserRole } from 'src/user/types/enum.user-role';

export const mapToProjectMembers = (members: User[]): MemberProject[] =>
  members.map((member) => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    photo: member.photo,
    phone: member.phone,
    email: member.email,
    projectRole: UserRole.PROJECT_MEMBER,
  }));

export const mapToProjectOwner = (user: User): ProjectOwner => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  photo: user.photo,
  email: user.email,
  phone: user.phone,
});

export const mapToProject = (project: Project): ProjectPublic => ({
  id: project.id,
  status: project.status,
  title: project.title,
  description: project.description,
  owner: mapToProjectOwner(project.owner),
  members: mapToProjectMembers(project.members),
});

export const mapToProjects = (project: Project[]): ProjectPublic[] =>
  project.map((project) => ({
    id: project.id,
    status: project.status,
    title: project.title,
    description: project.description,
    owner: mapToProjectOwner(project.owner),
    members: mapToProjectMembers(project.members),
  }));
