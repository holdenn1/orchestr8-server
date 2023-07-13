import { BadRequestException, Injectable } from '@nestjs/common';
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

    const { password, createAt, updateAt, ...user } = newUser;
    const tokens = await this.refreshTokenService.getTokens(
      newUser.id,
      newUser.email,
      newUser.roles,
    );
    await this.refreshTokenService.create({
      user: newUser,
      value: tokens.refreshToken,
    });

    return { ...tokens, user };
  }

  async login(data: CreateAuthDto) {
    const findUser = await this.userService.findOneByEmail(data.email);
    const { password, createAt, updateAt, ...user } = findUser;
    if (!findUser) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(
      findUser.password,
      data.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.refreshTokenService.getTokens(
      findUser.id,
      findUser.email,
      findUser.roles,
    );
    await this.refreshTokenService.create({
      user: findUser,
      value: tokens.refreshToken,
    });
    return { ...tokens, user };
  }

  logout(userId: number) {
    return this.refreshTokenService.removeToken(userId);
  }

  async refreshTokens(user: UserRequest) {
    return this.refreshTokenService.refreshTokens(user);
  }
}
