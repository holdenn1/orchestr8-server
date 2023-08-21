import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, In, ILike, And, Not } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { mapToProjectMembers, mapToProjectUsers } from 'src/project/mapers';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from 'src/firebase';
import { mapToUserProfile } from 'src/auth/mapers';
import { Member } from './entities/member.entity';
import { MemberRole } from './types/enum.user-role';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async create(dto: CreateUserDto) {
    return await this.userRepository.save(dto);
  }

  async uploadAvatar(userId: number, cover: Express.Multer.File) {
    const metadata = { contentType: 'image/jpeg' };
    const storageRef = ref(storage, 'images/' + cover.originalname);
    const uploadBook = uploadBytesResumable(storageRef, cover.buffer, metadata);

    await new Promise((res, rej) => {
      uploadBook.on('state_changed', null, rej, res as () => void);
    });

    const downloadURL = await getDownloadURL(uploadBook.snapshot.ref);
    await this.updateUser(userId, { photo: downloadURL });
    return downloadURL;
  }

  async findAll() {
    return this.userRepository.find({
      relations: {
        ownedProjects: true,
        refreshTokens: true,
      },
    });
  }

  async findAllByIds(userId: number, membersIds: number[]) {
    if (!membersIds.length) {
      return [];
    }
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.member', 'member')
      .where('user.id IN (:...ids)', { ids: membersIds })
      .andWhere('user.id != :id', { id: userId })
      .getMany();
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({
      relations: {
        ownedProjects: true,
        refreshTokens: true,
        member: true,
      },
      where: { id },
    });
  }

  async findOneUserForCheckRole(userId: number, projectId: number) {
    return await this.userRepository.findOne({
      relations: {
        member: {
          project: true,
        },
      },
      where: { id: userId, member: { project: { id: projectId } } },
    });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      relations: {
        ownedProjects: true,
        refreshTokens: true,
      },
      where: {
        email: email,
      },
    });
  }

  async updateUser(id: number, dto: Partial<UpdateUserDto>) {
    const user = await this.findOneById(id);
    user.firstName = dto.firstName ?? user.firstName;
    user.lastName = dto.lastName ?? user.lastName;
    user.phone = dto.phone ?? user.phone;
    user.photo = dto.photo ?? user.photo;
    return this.userRepository.save({ ...user });
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    await this.userRepository.remove(user);
  }

  async searchUsersByEmail(searchEmail: string, userId: number) {
    const users = await this.userRepository.find({
      where: { email: ILike(`%${searchEmail}%`), id: Not(userId) },
      take: 10,
    });
    return mapToProjectUsers(users);
  }

  async getUser(email: string) {
    const user = await this.findOneByEmail(email);
    return mapToUserProfile(user);
  }

  async getOneMember(projectId: number, memberId: number) {
    return await this.memberRepository.findOne({
      relations: { project: true, user: true },
      where: {
        project: { id: projectId },
        user: { id: memberId },
      },
    });
  }

  async removeMembers(membersIds: number[], projectId: number) {
    await this.memberRepository.delete({ user: { id: In(membersIds) }, project: { id: projectId } });
  }

  async setMemberRole(projectId: number, memberId: number, memberRole: MemberRole) {
    const member = await this.getOneMember(projectId, memberId);
    member.role = memberRole;
    const updatedMember = await this.memberRepository.save(member);
    const memberRoleToProfile = {
      projectId: updatedMember.project.id,
      memberId: updatedMember.user.id,
      memberRole: updatedMember.role,
    };
    return memberRoleToProfile;
  }
}
