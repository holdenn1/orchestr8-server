import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    return await this.userRepository.save(dto);
  }

  async findAll() {
    return this.userRepository.find({
      relations: {
        ownedProjects: true,
        memberProjects: true,
        refreshTokens: true,
      },
    });
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async update(id: number, dto: Partial<UpdateUserDto>) {
    return await this.userRepository.update(id, dto);
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    await this.userRepository.remove(user);
  }
}
