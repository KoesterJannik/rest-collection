import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/services/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsersService, PrismaService, AuthService, JwtService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
