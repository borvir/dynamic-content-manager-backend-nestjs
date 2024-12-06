import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/user/enitity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      isConfirmed: false,
    });

    const savedUser = await this.usersRepository.save(user);

    const confirmationToken = this.jwtService.sign(
      { email: savedUser.email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      },
    );

    const confirmationUrl = `${process.env.APP_URL}/auth/confirm?token=${confirmationToken}`;

    try {
      await this.mailerService.sendMail({
        to: savedUser.email,
        subject: 'Confirm your registration',
        text: `Please confirm your registration by clicking the following link: ${confirmationUrl}`,
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw new Error('Could not send confirmation email. Please try again.');
    }

    return {
      message:
        'Registration successful. Please check your email to confirm your account.',
    };
  }

  async confirmRegistration(token: string): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersRepository.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isConfirmed) {
        throw new BadRequestException('User is already confirmed');
      }

      user.isConfirmed = true;
      await this.usersRepository.save(user);

      return { message: 'Registration confirmed successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired confirmation token');
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isConfirmed) {
      throw new BadRequestException(
        'Account is not confirmed. Please check your email.',
      );
    }

    const payload = {
      email: user.email,
      userId: user.id,
      username: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    await this.usersRepository.save(user);

    return { message: 'Password successfully updated' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('No user found with this email address');
    }

    const resetToken = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '1h' },
    );

    const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested to reset your password. Click the following link to reset it: ${resetUrl}`,
    });

    return { message: 'Password reset email sent. Please check your inbox.' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersRepository.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await this.usersRepository.save(user);

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }
}
