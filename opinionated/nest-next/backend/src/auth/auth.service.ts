import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';
import { Prisma } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('Hit');
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user && (await this.validateUserPassword(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async hashPassword(clearPassword: string) {
    const saltRounds = Number(
      this.configService.get<number>('BCRYPT_SALT_ROUNDS'),
    );
    const hashedPassword = await bcrypt.hash(clearPassword, saltRounds);
    return hashedPassword;
  }
  async validateUserPassword(
    clearPassword: string,
    hashedPassword: string,
  ): Promise<any> {
    const match = await bcrypt.compare(clearPassword, hashedPassword);
    return match;
  }

  async login(user: any) {
    console.log(user);
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async isEmailInUse(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user !== null;
  }
  async register(data: Prisma.UserCreateInput) {
    console.log(data);
    if (await this.isEmailInUse(data.email)) {
      return HttpStatus.CONFLICT;
    }
    const hashedPassword = await this.hashPassword(data.password);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });
    return this.login(user);
  }
}
