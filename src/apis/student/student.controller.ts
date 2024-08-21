import { Controller, Get, UnauthorizedException, Headers, Post, UploadedFiles, Body, UseInterceptors, Put, Param, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';
import { auth } from 'firebase-admin';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { MediaService } from '../media/media.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly jwtService: JwtService,
        private readonly mediaService: MediaService
    ) {}

    @Get('all-students')
    @Role('schoolAdmin')
    async getAllStudentsForSchool(
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
        return await this.studentService.getAllStudentsForSchool(userId);
    }
    @Get(':studentId')
    @Role('schoolAdmin')
    async getStudentProfile(
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
        return await this.studentService.getStudentProfile(userId);
    }

    @Post('enroll')
    @Role('schoolAdmin')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'files', maxCount: 10}
    ]))
    async enrollNewStudent(
        @Headers('authorization') authHeader: string,
        @UploadedFiles() files: {files?: Express.Multer.File[]},
        @Body() enrollNewStudentDto: EnrollStudentDto
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
          const newStudent = await this.studentService.enrollNewStudent(enrollNewStudentDto, userId);
          let media = [];
          if (files && files.files && files.files.length > 0) {
            media = await this.mediaService.uploadMedia(files.files, userId);
            for (const mediaItem of media) {
                await this.studentService.associateMediaWithStudent(newStudent.id, mediaItem.id)
            }
          }
          return {...newStudent, media}
     }

     @Put(':studentId')
     @UseInterceptors(FileFieldsInterceptor([
        {name: 'avatar', maxCount: 1}
     ]))
     @Role('schoolAdmin')
     async updateStudent(
        @Param('studentId') studentId: number,
        @UploadedFiles() files: {avatar?: Express.Multer.File[]},
        @Body() updateStudentDto: UpdateStudentDto,
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
          return await this.studentService.updateStudent(studentId, updateStudentDto, files.avatar || [], userId);
     }
     
     @Delete(':studentId')
     @Role('schoolAdmin')
     async deleteStudent(
        @Param('studentId') studentId: number,
        @Headers('authorization') authHeader: string
     ): Promise<{message: string}> {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
          }
      
          const token = authHeader.replace('Bearer ', '');
          const decodedToken = this.jwtService.verifyToken(token);
      
          const { userId } = decodedToken;
          if (!userId) {
            throw new UnauthorizedException('Invalid token');
          }
          await this.studentService.deleteStudent(studentId);
          return {message: 'Student deleted successfully'};
     }
} 
