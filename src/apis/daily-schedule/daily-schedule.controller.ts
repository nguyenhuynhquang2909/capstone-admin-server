import { Controller, Get, Head, Headers, UnauthorizedException } from '@nestjs/common';
import { DailyScheduleService } from './daily-schedule.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('daily-schedule')
export class DailyScheduleController {
    constructor(
        private readonly scheduleService: DailyScheduleService,
        private readonly jwtService: JwtService
    ) {}

    @Get('all-schedules')
    @Role('schoolAdmin')
    async getAllSchedules(
        @Headers('authorization') authHeader: string
    ) {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }
        const token = authHeader.replace('Bearer ', '');
        const decodedToken = this.jwtService.verifyToken(token);
        const {userId} = decodedToken;

        if (!userId) {
            throw new UnauthorizedException('Invalid token');
        }
        return await this.scheduleService.getAllSchedules(userId);
    }
}
