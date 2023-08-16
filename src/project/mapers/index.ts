import { User } from 'src/user/entities/user.entity';
import { ProjectMember, ProjectOwner, ProjectPublic, UserToProfile } from '../types';
import { Project } from '../entities/project.entity';
import { Member } from 'src/user/entities/member.entity';

export const mapToProjectMembers = (members: Member[]): ProjectMember[] =>
  members.map(({ user, role }) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    photo: user.photo,
    phone: user.phone,
    email: user.email,
    role: role,
  }));

export const mapToProjectUsers = (users: User[]): UserToProfile[] =>
  users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    photo: user.photo,
    email: user.email,
    phone: user.phone,
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
