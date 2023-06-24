import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const candidate = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (candidate) throw new BadRequestException('This user already exist');
    const user = await this.userRepository.save({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 5),
    });
    return user;
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: {
        projects: true,
      },
    });
    return users;
  }

  async findOne(id: number): Promise<User | null> {
    const users = await this.userRepository.findOneBy({ id });
    if (!users) {
      throw new NotFoundException(`Users found`);
    }
    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = await this.userRepository.save({
      id,
      ...updateUserDto,
    });
    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const removedUser = await this.userRepository.remove(user);
    return removedUser;
  }
}
