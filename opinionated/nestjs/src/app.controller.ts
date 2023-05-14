import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/constants';
import { CreateUserDto } from './auth/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @ApiTags('auth')
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Body() createUserDto: CreateUserDto) {
    return this.authService.login(req.user);
  }
  @Public()
  @Post('auth/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
