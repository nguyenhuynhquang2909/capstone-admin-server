import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import * as jwt from 'jsonwebtoken';
  
  @Injectable()
  export class JwtGuard implements CanActivate {
    private readonly secretKey: string =
      process.env.JWT_SECRET || 'default_secret_key';
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
  
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header is missing');
      }
  
      const token = authHeader.replace('Bearer ', '');
      try {
        const decodedToken = this.verifyToken(token);
        request.user = decodedToken;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  
    generateToken(payload: any): string {
      return jwt.sign(payload, this.secretKey, {
        expiresIn: process.env.JWT_EXPIRATION_TIME || '1h',
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