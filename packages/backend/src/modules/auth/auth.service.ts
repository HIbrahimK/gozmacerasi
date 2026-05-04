import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse, AuthUserPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const user = this.createUser(dto.email, dto.fullName);
    return this.createAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = this.createUser(dto.email);
    return this.createAuthResponse(user);
  }

  private createUser(email: string, fullName?: string): AuthUserPayload {
    return {
      sub: `user_${Buffer.from(email).toString('hex').slice(0, 12)}`,
      email,
      fullName,
    };
  }

  private createAuthResponse(user: AuthUserPayload): AuthResponse {
    return {
      accessToken: this.jwtService.sign({
        sub: user.sub,
        email: user.email,
        fullName: user.fullName,
      }),
      user: {
        id: user.sub,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}
