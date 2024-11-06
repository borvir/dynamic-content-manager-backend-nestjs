import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/user/enitity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = {
        email: user.email,
        userId: user.id,
        username: user.username,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new Error('Invalid credentials');
  }
}
