import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey: string =
    process.env.JWT_SECRET || 'default_secret_key';

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || '8760h',
    });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
