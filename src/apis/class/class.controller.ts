import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';
import { CreateClassDto } from './dto/create-class.dto';
import { AddStudentToClassDto } from './dto/add-student-to-class.dto';
import { Class } from 'src/common/entities/class.entity';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('class')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @Role('schoolAdmin')
  async getAllClasses(@Headers('authorization') authHeader: string) {
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

  @Get(':classId/student')
  @Role('schoolAdmin')
  async getClassStudents(@Param('classId') classId: number) {
    try {
      return await this.classService.getClassStudents(classId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Class not found');
      }
      throw error;
    }
  }
  @Post('create')
  @Role('schoolAdmin')
  async createClass(@Body() createClassDto: CreateClassDto) {
    return this.classService.createClass(createClassDto);
  }
  @Put(':id')
  @Role('schoolAdmin')
  async updateClass(
    @Param('id') classId: number,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return await this.classService.updateClass(classId, updateClassDto);
  }

  @Post(':classId')
  @Role('schoolAdmin')
  async addStudentToClass(
    @Param('classId') classId: number,
    @Body() addStudentToClassDto: AddStudentToClassDto,
  ) {
    await this.classService.addStudentToClass(classId, addStudentToClassDto);
    return { message: 'Student added to class successfully' };
  }

  @Delete(':id')
  async removeClass(
    @Param('id') classId: number,
  ): Promise<{ message: string }> {
    await this.classService.removeClass(classId);
    return { message: 'Class removed successfully' };
  }

  @Delete(':classId/student/:studentId')
  async removeStudentFromClass(
    @Param('classId') classId: number,
    @Param('studentId') studentId: number,
  ): Promise<{ message: string }> {
    await this.classService.removeStudentFromClass(classId, studentId);
    return { message: 'Student removed from class successfully' };
  }
}
