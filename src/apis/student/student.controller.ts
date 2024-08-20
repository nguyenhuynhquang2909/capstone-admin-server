import { Controller, Get, UnauthorizedException, Headers } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('students')
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly jwtService: JwtService
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

}
