import { Controller, Post, Get, Body, Query, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get('all')
    @UseGuards(JwtAuthGuard) // Rota protegida com o JWT
    async findAll(@Query('page') page: string) {
        const pageNumber = parseInt(page) || 1;
        return this.projectsService.findAllProjects(pageNumber);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.projectsService.findProjectById(id);
    }
}