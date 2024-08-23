import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
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
import { auth } from 'firebase-admin';

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

  @Get(':classId/students')
  @Role('schoolAdmin')
  async getClassStudents(
    @Param('classId') classId: number,
    @Headers('authorization') authHeader: string,
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

    try {
      return await this.classService.getClassStudents(classId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Class not found');
      }
      throw error;
    }
  }

  @Get(':classId/students/:studentId/profile')
  @Role('schoolAdmin')
  async getClassStudentProfile(
    @Param('classId') classId: number,
    @Param('studentId') studentId: number,
    @Headers('authorization') authHeader: string,
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
    const classStudentProfile = await this.classService.getClassStudentProfile(
      classId,
      studentId,
    );
    if (!classStudentProfile) {
      throw new NotFoundException('Class or student not found');
    }
    return classStudentProfile;
  }

  @Post('create')
  @Role('schoolAdmin')
  async createClass(
    @Body() createClassDto: CreateClassDto,
    @Headers('authorization') authHeader: string,
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
    return this.classService.createClass(createClassDto);
  }
  @Put(':id')
  @Role('schoolAdmin')
  async updateClass(
    @Param('id') classId: number,
    @Body() updateClassDto: UpdateClassDto,
    @Headers('authorization') authHeader: string,
  ): Promise<Class> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.classService.updateClass(classId, updateClassDto);
  }

  @Post(':classId')
  @Role('schoolAdmin')
  async addStudentToClass(
    @Param('classId') classId: number,
    @Body() addStudentToClassDto: AddStudentToClassDto,
    @Headers('authorization') authHeader: string,
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

    await this.classService.addStudentToClass(classId, addStudentToClassDto);
    return { message: 'Student added to class successfully' };
  }

  @Delete(':id')
  @Role('schoolAdmin')
  async removeClass(
    @Param('id') classId: number,
    @Headers('authorization') authHeader: string,
  ): Promise<{ message: string }> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.classService.removeClass(classId);
    return { message: 'Class removed successfully' };
  }

  @Delete(':classId/student/:studentId')
  @Role('schoolAdmin')
  async removeStudentFromClass(
    @Param('classId') classId: number,
    @Param('studentId') studentId: number,
    @Headers('authorization') authHeader: string,
  ): Promise<{ message: string }> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    await this.classService.removeStudentFromClass(classId, studentId);
    return { message: 'Student removed from class successfully' };
  }
}
