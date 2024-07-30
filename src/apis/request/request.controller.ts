import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestService } from './request.service';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

// DTO
import { CreateRequestDto } from './dto/create-request.dto';

@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly jwtService: JwtService,
  ) {}

  @Post(':id')
  async createRequest(
    @Headers('authorization') authHeader: string,
    @Param('id') studentId: number,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);
    return this.requestService.createRequest(
      userId,
      studentId,
      createRequestDto,
    );
  }

  @Get()
  async getRequestHistory(@Headers('authorization') authHeader: string) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);
    return this.requestService.getRequestHistory(userId);
  }

  private verifyAuthHeader(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
  }

  private getUserIdFromToken(authHeader: string): number {
    const token = authHeader.replace('Bearer ', '');
    try {
      const decodedToken = this.jwtService.verifyToken(token);
      return decodedToken.userId;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
