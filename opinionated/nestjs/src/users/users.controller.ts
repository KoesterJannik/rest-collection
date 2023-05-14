import { Controller, Request, UseGuards, Body, Get, Put } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}
  @ApiBearerAuth()
  @Get('me')
  async me(@Request() req) {
    return this.userService.getDetails(req.user.email);
  }
  @ApiBearerAuth()
  @Put('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(
      req.user.email,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}
