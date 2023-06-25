import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }
}
