import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfiguration } from './config/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { UserExistValidator } from './validation/UserExistValidator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      load: [getConfiguration]
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.postgres.host'),
        port: configService.get<number>('db.postgres.port'),
        username: configService.get<string>('db.postgres.username'),
        password: configService.get<string>('db.postgres.password'),
        database: configService.get<string>('db.postgres.database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([
      UserEntity
    ]),
  ],
  controllers: [AppController, UserController, AuthorizationController],
  providers: [AppService, UserService, AuthorizationService, UserExistValidator, JwtAuthGuard, JwtStrategy, JwtService],
})
export class AppModule {}
