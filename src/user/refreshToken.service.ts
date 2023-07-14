import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refreshToken.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import { UserRequest } from '../auth/types';
import { CreateTokenDto } from './dto/create-token.dto';

const MAX_DEVICE_COUNT = 5;

export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create({ user, value }: CreateTokenDto) {
    const [tokens, count] = await this.refreshTokenRepository.findAndCount({
      relations: {
        user: true,
      },
      where: { user: { id: user.id } },
    });

    if (count >= MAX_DEVICE_COUNT) {
      await this.removeToken(user.id);
      return await this.refreshTokenRepository.save({
        user,
        refreshToken: value,
      });
    }

    return await this.refreshTokenRepository.save({
      user,
      refreshToken: value,
    });
  }

  async getTokens(userId: number, email: string, roles: string[]) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          roles,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          roles,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      userId,
      email,
      roles,
      accessToken,
      refreshToken,
    };
  }

  async removeToken(userId: number) {
    const token = await this.findLastUpdateToken(userId);
    await this.refreshTokenRepository.remove(token);
  }

  async findLastUpdateToken(userId: number) {
    return await this.refreshTokenRepository.findOne({
      relations: {
        user: true,
      },
      where: { user: { id: userId } },
      order: {
        updateAt: 'DESC',
      },
    });
  }

  async update(tokenId: number, refreshToken: string) {
    return await this.refreshTokenRepository.update(tokenId, { refreshToken });
  }

  async refreshTokens(user: UserRequest) {
    const token = await this.refreshTokenRepository.findOne({
      where: {
        refreshToken: user.refreshToken,
      },
    });

    if (!token) {
      throw new ForbiddenException('Access Denied');
    } else if (token.refreshToken !== user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user.sub, user.email, user.roles);
    await this.update(token.id, tokens.refreshToken);
    return tokens;
  }
}