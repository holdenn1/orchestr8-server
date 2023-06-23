import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project/project.service';
import { ProjectModule } from './project/project.module';
import { User } from './user/entities/user.entity';
import { Project } from './project/entities/project.entity';

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
        entities: [User, Project],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProjectService],
})
export class AppModule {}
