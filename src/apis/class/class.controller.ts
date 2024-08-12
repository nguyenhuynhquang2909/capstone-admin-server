import { Body, Controller, Get, Header, Headers, NotFoundException, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ClassService } from './class.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';
import { CreateClassDto } from './dto/create-class.dto';
import { AddStudentToClassDto } from './dto/add-student-to-class.dto';

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
    @Post()
    async createClass(@Body() createClassDto: CreateClassDto) {
        return this.classService.createClass(createClassDto);
    }   
    @Post(':classId')
    async addStudentToClass(
        @Param('classId') classId: number,
        @Body() addStudentToClassDto: AddStudentToClassDto,
    ) {
        await this.classService.addStudentToClass(classId, addStudentToClassDto);
        return {message: 'Student added to class successfully'}
    }

    

}
