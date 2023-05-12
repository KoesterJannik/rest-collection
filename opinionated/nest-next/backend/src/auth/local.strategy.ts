import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    console.log('RUn constructor');
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('Called');
    console.log(
      'LocalStrategy.validate() username:',
      username,
      'password:',
      password,
    );
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
