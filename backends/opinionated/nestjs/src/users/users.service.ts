import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async getDetails(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    const { password, ...result } = user;
    return result;
  }

  async changePassword(email, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (
      user &&
      (await this.authService.validateUserPassword(oldPassword, user.password))
    ) {
      const hashedPassword = await this.authService.hashPassword(newPassword);
      const updatedUser = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          password: hashedPassword,
        },
      });
      return HttpStatus.OK;
    }
    return HttpStatus.UNAUTHORIZED;
  }
}
