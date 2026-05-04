import { Controller, Post, Get, Body, Query, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { LinkEmployeesDto } from './dto/link-employees.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.createProject(createProjectDto);
    }

    @Post(':projectId/employees')
    @UseGuards(JwtAuthGuard)
    async linkEmployees(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body() linkEmployeesDto: LinkEmployeesDto
    ) {
        return this.projectsService.linkEmployeesToProject(projectId, linkEmployeesDto.employeeIds);
    }

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