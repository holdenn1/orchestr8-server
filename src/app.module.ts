import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { User } from './user/entities/user.entity';
import { Project } from './project/entities/project.entity';
import { RefreshToken } from './user/entities/refreshToken.entity';
import { Task } from './task/entities/task.entity';
import { TaskModule } from './task/task.module';
import { SocketModule } from './socket/socket.module';
import { Member } from './user/entities/member.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
    SocketModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Project, Member, RefreshToken, Task],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProjectModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
