import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { UserRegisterDto } from 'src/core/dto/user-register.dto';
import { UserLoginDto } from 'src/core/dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({
    type: UserRegisterDto,
    required: true,
    description: '',
  })
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(email, password);
  }

  @Post('login')
  @ApiBody({
    type: UserLoginDto,
    required: true,
    description: '',
  })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }
}
