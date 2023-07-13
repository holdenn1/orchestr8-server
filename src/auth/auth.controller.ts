import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @UsePipes(new ValidationPipe())
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: CreateAuthDto) {
    return this.authService.login(data);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req) {
    this.authService.logout(req.user['sub']);
  }

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refreshTokens(@Req() req) {
    return this.authService.refreshTokens(req.user);
  }
}
