import { Controller, Get, UnauthorizedException, Headers, Param } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('teacher')
export class TeacherController {
    constructor(
        private readonly teacherService: TeacherService,
        private readonly jwtService: JwtService
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
}
