import { Body, Controller, Headers, Logger, Post, Req, UnauthorizedException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EatingScheduleService } from './eating-schedule.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateEatingScheduleDto } from './dto/create-eating-schedule.dto';
import { MediaService } from '../media/media.service';
import { Request } from 'express';

@Controller('eating-schedule')
export class EatingScheduleController {
    constructor(
        private readonly eatingScheduleService: EatingScheduleService,
        private readonly jwtService: JwtService,
        private readonly mediaService: MediaService
    ) {}

    @Post('create')
    @Role('schoolAdmin')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
    async createEatingSchedule(
        @UploadedFiles() files: { files?: Express.Multer.File[] },
        @Body() createEatingScheduleDto: CreateEatingScheduleDto,
        @Req() req: Request
    ) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }
        const token = authHeader.replace('Bearer ', '');
        const decodedToken = this.jwtService.verifyToken(token);
        const { userId } = decodedToken;

        Logger.log('Schedule Input:', createEatingScheduleDto);

        const newEatingSchedule = await this.eatingScheduleService.createEatingSchedule(createEatingScheduleDto, userId);
        let media = [];
        if (files && files.files && files.files.length > 0) {
            media = await this.mediaService.uploadMedia(files.files, userId);
            for (const mediaItem of media) {
                await this.eatingScheduleService.associateMediaWithEatingSchedule(newEatingSchedule.id, mediaItem.id);
            }
        }

        return { ...newEatingSchedule, media };
    }
}
