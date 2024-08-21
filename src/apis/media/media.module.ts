import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { RoleConfigService } from 'src/common/services/role-config.service';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

// Entities
import { Media } from '../../common/entities/media.entity';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, SchoolAdmin])],
  providers: [MediaService, JwtService, JwtGuard, RoleGuard, RoleConfigService],
  controllers: [MediaController],
})
export class MediaModule {}
