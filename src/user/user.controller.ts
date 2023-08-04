import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  Req,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('upload-cover')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('cover'))
  uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadAvatar(req.user.sub, file);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('get-user')
  @UseGuards(AccessTokenGuard)
  getUser(@Req() req) {
    return this.userService.getUser(req.user.email);
  }
}
