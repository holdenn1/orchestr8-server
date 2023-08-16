import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  Req,
  Post,
  Patch,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MemberRole } from './types/enum.user-role';

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

  @Patch('update/member-role/:id')
  @UseGuards(AccessTokenGuard)
  async setMemberRole(@Param('id') id: string, @Body() updateMemberRole: { memberRole: MemberRole }) {
    await this.userService.setMemberRole(+id, updateMemberRole.memberRole);
  }
}
