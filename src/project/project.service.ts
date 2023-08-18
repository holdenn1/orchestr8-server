import { Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ILike, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { mapToProjectMembers, mapToProject, mapToProjects } from './mapers';
import { StatusProject } from './types';
import { MemberRole } from 'src/user/types/enum.user-role';
import { Member } from 'src/user/entities/member.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    private userService: UserService,
  ) {}

  async create(userId: number, { title, description, membersIds }: CreateProjectDto) {
    const user = await this.userService.findOneById(userId);
    const getMembers = membersIds ? await this.userService.findAllByIds(userId, membersIds) : [];

    const members = getMembers.map((user) => {
      const createdMember = new Member();
      createdMember.user = user;
      createdMember.role = MemberRole.PROJECT_MEMBER;
      return createdMember;
    });

    const project = await this.projectRepository.save({
      title,
      description,
      members,
      owner: user,
    });
    return mapToProject(project);
  }

  async updateProject(userId: number, projectId: number, dto: Partial<UpdateProjectDto>) {
    const project = await this.findOneById(projectId);
    const user = await this.userService.findOneUserForCheckRole(userId, projectId);

    if (
      project.owner.id === userId ||
      user?.member.some((member) => member.role === MemberRole.PROJECT_MANAGER)
    ) {
      project.title = dto.title ?? project.title;
      project.description = dto.description ?? project.description;

      if (project.owner.id == userId) {
        project.status = dto.status ?? project.status;
      }

      if (dto.membersIds) {
        const filterDtoMemberIds = dto.membersIds.filter((id) => id !== project.owner.id);

        const getUsers = filterDtoMemberIds
          ? await this.userService.findAllByIds(userId, filterDtoMemberIds)
          : [];
        const projectMembersIds = mapToProjectMembers(project.members).map((member) => member.id);
        const newMembers = getUsers.filter((user) => !projectMembersIds.includes(user.id));

        if (filterDtoMemberIds) {
          const membersToDelete = mapToProjectMembers(project.members).filter((member) =>
            filterDtoMemberIds.includes(member.id),
          );
          if (membersToDelete.length) {
            const memberToDeleteIds = membersToDelete.map((member) => member.id);
            project.members = project.members.filter(({ user }) => !memberToDeleteIds.includes(user.id));
            await this.userService.removeMembers(memberToDeleteIds, projectId);
          }
        }

        if (newMembers.length) {
          const members = newMembers.map((user) => {
            const createdMember = new Member();
            createdMember.user = user;
            createdMember.role = MemberRole.PROJECT_MEMBER;
            return createdMember;
          });
          project.members = filterDtoMemberIds ? [...project.members, ...members] : project.members;
        }
      }

      const updatedProject = await this.projectRepository.save(project);
      return mapToProject(updatedProject);
    } else {
      throw new ForbiddenException();
    }
  }

  async removeProject(id: number, userId: number) {
    const project = await this.findOneById(id);
    if (project.owner.id == userId) {
      const removerProject = await this.projectRepository.remove(project);
      if (!removerProject) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
      return mapToProject({ ...removerProject, id });
    }
  }

  async searchOwnProjects(searchText: string, userId: number, status: StatusProject) {
    const findProjects = await this.projectRepository.find({
      relations: { members: { user: true }, owner: true, tasks: true },
      where: {
        owner: { id: userId },
        title: ILike(`%${searchText}%`),
        ...(status !== StatusProject.ALL && { status }),
      },
    });
    return mapToProjects(findProjects);
  }

  async searchForeignProjects(searchText: string, userId: number, status: StatusProject) {
    const findProjects = await this.projectRepository.find({
      relations: { members: { user: true }, owner: true, tasks: true },
      where: {
        members: { user: { id: userId } },
        title: ILike(`%${searchText}%`),
        ...(status !== StatusProject.ALL && { status }),
      },
    });
    return mapToProjects(findProjects);
  }

  async searchUsers(searchEmail: string, userId: number) {
    return await this.userService.searchUsersByEmail(searchEmail, userId);
  }

  async findOneById(id: number) {
    return await this.projectRepository.findOne({
      where: { id },
      relations: { members: { user: true }, owner: true, tasks: true },
    });
  }

  async getOwnProjects(userId: number, status: StatusProject, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const findProjects = await this.projectRepository.find({
      relations: {
        owner: true,
        members: {
          user: true,
        },
        tasks: true,
      },
      where: {
        owner: {
          id: userId,
        },
        ...(status !== StatusProject.ALL && { status }),
      },
      order: {
        createAt: 'DESC',
      },
      skip,
      take: pageSize,
    });

    return mapToProjects(findProjects);
  }

  async geOwnProjectCountsByStatus(userId: number) {
    const result = await this.projectRepository
      .createQueryBuilder('project')
      .select('COUNT(*)', 'totalCount')
      .addSelect('SUM(CASE WHEN project.status = :completed THEN 1 ELSE 0 END)', 'completed')
      .addSelect('SUM(CASE WHEN project.status = :progress THEN 1 ELSE 0 END)', 'in-progress')
      .addSelect('SUM(CASE WHEN project.status = :suspend THEN 1 ELSE 0 END)', 'suspend')
      .leftJoin('project.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .groupBy('owner.id')
      .setParameters({
        completed: 'completed',
        progress: 'in-progress',
        suspend: 'suspend',
      })
      .getRawMany();
    return result;
  }
  /* ====================================================================================== */

  /* find Foreign projects */

  async getForeignProjects(memberId: number, status: StatusProject, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const findProjects = await this.projectRepository.find({
      relations: {
        owner: true,
        members: { user: true },
        tasks: true,
      },
      where: {
        members: {
          user: { id: memberId },
        },

        ...(status !== StatusProject.ALL && { status }),
      },
      order: {
        createAt: 'ASC',
      },
      skip,
      take: pageSize,
    });

    return mapToProjects(findProjects);
  }

  async geForeignProjectCountsByStatus(userId: number) {
    const result = await this.projectRepository
      .createQueryBuilder('project')
      .select('COUNT(*)', 'totalCount')
      .addSelect('SUM(CASE WHEN project.status = :completed THEN 1 ELSE 0 END)', 'completed')
      .addSelect('SUM(CASE WHEN project.status = :progress THEN 1 ELSE 0 END)', 'in-progress')
      .addSelect('SUM(CASE WHEN project.status = :suspend THEN 1 ELSE 0 END)', 'suspend')
      .leftJoin('project.members', 'members')
      .where('members.user.id = :userId', { userId })
      .groupBy('members.user.id')
      .setParameters({
        completed: 'completed',
        progress: 'in-progress',
        suspend: 'suspend',
      })
      .getRawMany();

    return result;
  }

  /* ====================================================================================== */
}
