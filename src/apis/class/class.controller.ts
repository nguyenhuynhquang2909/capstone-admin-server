import { Controller, Get, Header, Headers, NotFoundException, Param, UnauthorizedException } from '@nestjs/common';
import { ClassService } from './class.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('class')
export class ClassController {
    constructor(
        private readonly classService: ClassService,
        private readonly jwtService: JwtService
    ) {}

    @Get('all-classes')
    @Role('schoolAdmin')
    async getAllClasses(
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
      
          return await this.classService.getAllClasses(userId);
    }

    @Get(':id')
    @Role('schoolAdmin')
    async getClassStudents(@Param('id') classId: number) {
        try {
            return await this.classService.getClassStudents(classId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Class not found');
            }
            throw error;
        }
    }

}
