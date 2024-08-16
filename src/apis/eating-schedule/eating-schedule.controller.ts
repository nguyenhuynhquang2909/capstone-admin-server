import { Body, Controller, Headers, Post, UnauthorizedException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EatingScheduleService } from './eating-schedule.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateEatingScheduleDto } from './dto/create-eating-schedule.dto';

@Controller('eating-schedule')
export class EatingScheduleController {
    constructor(
        private readonly eatingScheduleService: EatingScheduleService,
        private readonly jwtService: JwtService
    ) {}

    @Post()
    @Role('schoolAdmin')
    @UseInterceptors(FileFieldsInterceptor([{name: 'media', maxCount: 5}]))
    async createEatingSchedule(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createEatingScheduleDto: CreateEatingScheduleDto,
        @Headers('authorization') authHeader: string,
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
        return await this.eatingScheduleService.createEatingSchedule(createEatingScheduleDto, files, userId)

    }
}
