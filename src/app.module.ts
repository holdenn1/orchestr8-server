import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { User } from './user/entities/user.entity';
import { Project } from './project/entities/project.entity';
import { RefreshToken } from './user/entities/refreshToken.entity';
import { Task } from './project/entities/task.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
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
        entities: [User, Project, RefreshToken, Task],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
