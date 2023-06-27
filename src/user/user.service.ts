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
    const user = await this.userRepository.save(dto);
    return user;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
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

  async update(id: number, dto: Partial<UpdateUserDto> ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      const updatedUser = this.userRepository.merge(user, dto);
      return await this.userRepository.save(updatedUser);
    }
    return undefined;
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
