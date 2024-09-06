import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/common/entities/location.entity';
import { JwtService } from 'src/common/jwt/jwt.service';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Location,
      SchoolAdmin
    ])
  ],
  providers: [LocationService, JwtService],
  controllers: [LocationController]
})
export class LocationModule {}
