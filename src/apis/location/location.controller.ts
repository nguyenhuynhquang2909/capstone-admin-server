import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { LocationService } from './location.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('location')
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
        private readonly jwtService: JwtService
    ) {}

    @Get()
    @Role('schoolAdmin')
    async getAllLocations(@Headers('authorization') authHeader: string)
    {
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
          }
          const token = authHeader.replace('Bearer ', '');
          const decodedToken = this.jwtService.verifyToken(token);
          const { userId } = decodedToken;
          return this.locationService.getAllLocations(userId);
    }
}

