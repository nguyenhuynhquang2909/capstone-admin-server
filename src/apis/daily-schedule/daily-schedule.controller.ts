import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { DailyScheduleService } from './daily-schedule.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';
import { CreateDailyScheduleDto } from './dto/create-daily-schedule.dto';

@Controller('schedule')
export class DailyScheduleController {
  constructor(
    private readonly scheduleService: DailyScheduleService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('all-schedules')
  @Role('schoolAdmin')
  async getAllSchedules(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);
    const { userId } = decodedToken;

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.scheduleService.getAllSchedules(userId);
  }

  @Post('create')
  @Role('schoolAdmin')
  async createSchedule(
    @Headers('authorization') authHeader: string,
    @Body() CreateDailyScheduleDto: CreateDailyScheduleDto,
  ) {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);
    const {userId} = decodedToken;

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.scheduleService.createDailySchedule(
      CreateDailyScheduleDto,
      userId
    );
  }

}
