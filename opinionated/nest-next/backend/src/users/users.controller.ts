import { Controller, Request, UseGuards, Body, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Controller('users')
export class UserController {
  //constructor(private authService: AuthService) {}
  @ApiBearerAuth()
  @Get('me')
  async me(@Request() req) {
    return req.user;
  }
}
