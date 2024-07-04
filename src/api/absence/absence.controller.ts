import { Controller, Get, UseGuards, Req, Body, Post } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateAbsenceDto } from './dto/create-absence.dto';

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

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createAbsence(@Req() request: any, @Body() createAbsenceDto: CreateAbsenceDto) {
        const user = request.user;
        const parentId = user.id;
        return this.absenceService.createAbsence(parentId, createAbsenceDto);
    }
}
