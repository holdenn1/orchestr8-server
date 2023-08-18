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

  @Get('get-user')
  @UseGuards(AccessTokenGuard)
  getUser(@Req() req) {
    return this.userService.getUser(req.user.email);
  }

  @Patch('update-project/:projectId/member/:memberId')
  @UseGuards(AccessTokenGuard)
  async setMemberRole(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberRole: { memberRole: MemberRole },
  ) {
    await this.userService.setMemberRole(+projectId, +memberId, updateMemberRole.memberRole);
  }
}
