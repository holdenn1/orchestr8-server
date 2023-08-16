import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refreshToken.entity';
import { RefreshTokenService } from './refreshToken.service';
import { JwtModule } from '@nestjs/jwt';
import { Member } from './entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, Member]),
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService, RefreshTokenService],
  exports: [UserService, RefreshTokenService],
})
export class UserModule {}
