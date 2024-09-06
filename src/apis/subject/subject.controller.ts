import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { Role } from 'src/common/decorators/role.decorator';
import { JwtService } from 'src/common/jwt/jwt.service';

@Controller('subject')
export class SubjectController {
    constructor(
        private readonly subjectService: SubjectService,
        private readonly jwtService: JwtService
    ){}

    @Get()
    @Role('schoolAdmin')
    async getAllSubjects(
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
          return this.subjectService.getAllSubjects();
    }
}
