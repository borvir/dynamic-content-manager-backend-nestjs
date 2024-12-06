import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserRegisterDto } from 'src/core/dto/user-register.dto';
import { UserLoginDto } from 'src/core/dto/user-login.dto';
import { UserChangePasswordDto } from 'src/core/dto/user-change-password.dto';

@Controller('auth')
@ApiTags('auth')
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

  @Post('changePassword')
  @ApiBody({
    type: UserChangePasswordDto,
    required: true,
    description: '',
  })
  async changePassword(
    @Body('email') email: string,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(email, currentPassword, newPassword);
  }

  @Post('confirm')
  async confirmRegistration(@Query('token') token: string) {
    return this.authService.confirmRegistration(token);
  }

  @Post('forgot-password')
  @ApiBody({
    type: String,
    required: true,
    description: '',
  })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiBody({
    type: String,
    required: true,
    description: '',
  })
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
