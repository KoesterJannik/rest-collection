import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  providers: [
    UsersService,
    PrismaService,
    AuthService,
    JwtService,
    MailerService,
  ],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
