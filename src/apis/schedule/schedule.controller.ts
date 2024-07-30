import {
  Controller,
  Get,
  Param,
  Query,
  Headers,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

// DTO
import { GetScheduleDto } from './dto/get-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('learning/:id')
  async getLearningSchedule(
    @Headers('authorization') authHeader: string,
    @Param('id') studentId: number,
    @Query() query: GetScheduleDto,
  ) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    if (!query.startDate || !query.endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    return this.scheduleService.getLearningSchedule(
      userId,
      studentId,
      new Date(query.startDate),
      new Date(query.endDate),
    );
  }

  @Get('eating/:id')
  async getEatingSchedule(
    @Headers('authorization') authHeader: string,
    @Param('id') studentId: number,
    @Query() query: GetScheduleDto,
  ) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    if (!query.startDate || !query.endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    return this.scheduleService.getEatingSchedule(
      userId,
      studentId,
      new Date(query.startDate),
      new Date(query.endDate),
    );
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
