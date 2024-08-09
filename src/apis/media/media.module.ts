import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../../common/entities/media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';

// Common
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { RoleConfigService } from '../../common/services/role-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media, SchoolAdmin])],
  providers: [MediaService, JwtGuard, RoleGuard, RoleConfigService],
  controllers: [MediaController],
})
export class MediaModule {}
