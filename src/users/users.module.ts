import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from 'src/gurads/auth.gurd';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Creates repository for us.
  controllers: [UsersController],
  providers: [UsersService, AuthService, {provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor}]
})

export class UsersModule {}
