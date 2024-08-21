import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// Guard
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { RoleConfigService } from 'src/common/services/role-config.service';

import { Request } from '../../common/entities/request.entity';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { Class } from '../../common/entities/class.entity';
import { JwtService } from '../../common/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Request, SchoolAdmin, Class])],
  controllers: [RequestController],
  providers: [RequestService, JwtGuard, RoleGuard, RoleConfigService, JwtService],
})
export class RequestModule {}
