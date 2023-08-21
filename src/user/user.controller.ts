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
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MemberRole } from './types/enum.user-role';
import { SocketGateway } from 'src/socket/socket.gateway';
import { NotificationType } from 'src/socket/types';

@Controller('user')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService, private readonly socketGateway: SocketGateway) {}

  @Post('upload-cover')
  @UseInterceptors(FileInterceptor('cover'))
  uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadAvatar(req.user.sub, file);
  }

  @Get('get-user')
  getUser(@Req() req) {
    return this.userService.getUser(req.user.email);
  }

  @Patch('update-user-role-project/:projectId/member/:memberId')
  async setMemberRole(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberRole: { memberRole: MemberRole },
    @Headers('socketId') socketId: string,
  ) {
    const updatedMember = await this.userService.setMemberRole(
      +projectId,
      +memberId,
      updateMemberRole.memberRole,
    );
    this.socketGateway.emitToAll(NotificationType.UPDATE_MEMBER_ROLE, {
      payload: updatedMember,
      socketId,
    });
    return updatedMember;
  }
}
