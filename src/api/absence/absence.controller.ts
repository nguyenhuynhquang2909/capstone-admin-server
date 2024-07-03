import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('absence')
export class AbsenceController {
    constructor(private readonly absenceService: AbsenceService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll(@Req() request: any) {
        const user = request.user; 
        const parentId = user.id; 
        return this.absenceService.findAllAbsences(parentId);
    }
}
