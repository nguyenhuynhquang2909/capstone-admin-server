import { Controller, Get, UnauthorizedException, Headers, Param, Post, UseInterceptors, UploadedFiles, Body, Delete, Put } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { MediaService } from '../media/media.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teacher')
export class TeacherController {
    constructor(
        private readonly teacherService: TeacherService,
        private readonly jwtService: JwtService,
        private readonly mediaService: MediaService

    ) {}

    @Get('all-teachers')
    @Role('schoolAdmin')
    async getAllTeachers(
        @Headers('authorization') authHeader: string
    ) {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
          }
      
          const token = authHeader.replace('Bearer ', '');
          const decodedToken = this.jwtService.verifyToken(token);
      
          const { userId } = decodedToken;
          if (!userId) {
            throw new UnauthorizedException('Invalid token');
          }
          return this.teacherService.getAllTeachers(userId);
    }
    @Get(':teacherId/profile')
    @Role('schoolAdmin')
     async getTeacherProfile(
        @Param('teacherId') teacherId: number,
        @Headers('authorization') authHeader: string
     ) {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }
    
        const token = authHeader.replace('Bearer ', '');
        const decodedToken = this.jwtService.verifyToken(token);
    
        const { userId } = decodedToken;
        if (!userId) {
            throw new UnauthorizedException('Invalid token');
        }
        return this.teacherService.getTeacherProfile(teacherId);
     }

     @Post('create')
     @Role('schoolAdmin')
     @UseInterceptors(FileFieldsInterceptor([
        {name: 'profilePicture', maxCount: 1}
     ]))
     async createTeacher(
        @UploadedFiles() files: {profilePicture?: Express.Multer.File[]},
        @Body() createTeacherDto: CreateTeacherDto,
        @Headers('authorization') authHeader: string
     ) 
     {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }
      
        const token = authHeader.replace('Bearer ', '');
        const decodedToken = this.jwtService.verifyToken(token);
      
        const { userId } = decodedToken;
        if (!userId) {
            throw new UnauthorizedException('Invalid token');
        }
        const newTeacher = await this.teacherService.createTeacher(createTeacherDto, userId);

        if (files && files.profilePicture && files.profilePicture.length > 0) {
            const media = await this.mediaService.uploadMedia(files.profilePicture, userId);
            for (const mediaItem of media) {
                await this.teacherService.associateMediaWithTeacher(newTeacher.id, mediaItem.id);
            }
        } 
        return newTeacher;
     }

     @Put(':teacherId')
     @Role('schoolAdim')
     @UseInterceptors(FileFieldsInterceptor([
        {name: 'profilePicture', maxCount: 1}
     ]))
     async updateTeacher(
        @Param('teacherId') teacherId: number,
        @UploadedFiles() files: {profilePicture?: Express.Multer.File[]},
        @Body() updateTeacherDto: UpdateTeacherDto,
        @Headers('authorization') authHeader: string
     ) 
     {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authHeader.replace('Bearer ', '');
        const decodedToken = this.jwtService.verifyToken(token);

        const { userId } = decodedToken;
        if (!userId) {
            throw new UnauthorizedException('Invalid token');
        }
        return await this.teacherService.updateTeacher(teacherId, updateTeacherDto, files.profilePicture || [], userId);
     }

     @Delete(':teacherId')
     @Role('schoolAdmin')
     async deleteTeacher(
        @Param('teacherId') teacherId: number,
        @Headers('authorization') authHeader: string
     ): Promise<{message: string}>{
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authHeader.replace('Bearer ', '');
        const decodedToken = this.jwtService.verifyToken(token);
      
        const { userId } = decodedToken;
        if (!userId) {
            throw new UnauthorizedException('Invalid token');
        }
        await this.teacherService.deleteTeacher(teacherId);
        return {message: 'Teacher deleted successfully'}
     }


}
