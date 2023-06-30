import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon2 from 'argon2';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RefreshTokenService } from '../user/refreshToken.service';
import { UserRequest } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,

  ) {}

  async registration(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hash = await argon2.hash(createUserDto.password);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.refreshTokenService.getTokens(
      newUser.id,
      newUser.email,
      newUser.roles,
    );
    await this.refreshTokenService.create({
      user: newUser,
      value: tokens.refreshToken,
    });
    return tokens;
  }

  async login(data: CreateAuthDto) {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.refreshTokenService.getTokens(
      user.id,
      user.email,
      user.roles,
    );
    await this.refreshTokenService.create({ user, value: tokens.refreshToken });
    return tokens;
  }

  logout(userId: number) {
    return this.refreshTokenService.removeToken(userId);
  }

  async refreshTokens(user: UserRequest) {
    return this.refreshTokenService.refreshTokens(user);
  }
}
