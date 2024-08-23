import {
  Controller,
  Get,
  Patch,
  Param,
  Headers,
  UnauthorizedException,
  ForbiddenException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { JwtService } from '../../common/jwt/jwt.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('request')
@UseGuards(JwtGuard, RoleGuard)
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @Role('schoolAdmin')
  async getRequestsBySchool(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);
    const { userId } = decodedToken;

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    // Fetch school ID associated with the user
    const schoolId = await this.requestService.getSchoolIdForUser(userId);

    if (!schoolId) {
      throw new ForbiddenException('User is not associated with any school');
    }

    // Fetch requests associated with the school ID
    const requests = await this.requestService.getRequestsBySchoolId(schoolId);
    return requests;
  }

  @Patch(':id/:status')
  @Role('schoolAdmin')
  async updateRequestStatus(
    @Param('id', ParseIntPipe) requestId: number,
    @Param('status') status: string,
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

    // Check if user is associated with a school
    const schoolId = await this.requestService.getSchoolIdForUser(userId);

    if (!schoolId) {
      throw new ForbiddenException('User is not associated with any school');
    }

    // Update the request status
    const updatedRequest = await this.requestService.updateRequestStatus(
      requestId,
      status,
    );

    return updatedRequest;
  }
}
