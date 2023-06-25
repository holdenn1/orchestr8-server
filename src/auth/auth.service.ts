import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (user && isMatchPassword) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const { id, email, roles } = user;
    return {
      id,
      email,
      access_token: this.jwtService.sign({ id, email, roles }),
    };
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.findOne(userDto.email);
    if (candidate) throw new BadRequestException('This user already exist');
    const hashPassword = await bcrypt.hash(userDto.password, 7);
    const user = await this.userService.create({
      ...userDto,
      password: hashPassword,
    });
    const { id, email, roles } = user;
    return {
      id,
      email,
      access_token: this.jwtService.sign({ id, email, roles }),
    };
  }
}
