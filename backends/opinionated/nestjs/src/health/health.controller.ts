import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { Public } from 'src/auth/constants';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return HttpStatus.OK;
  }
}
