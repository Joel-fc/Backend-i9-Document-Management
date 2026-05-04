import { Controller, Get, Post, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDocumentDto } from './dto/create-document.dto';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':employeeId/documents')
  async getEmployeeDocuments(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.employeesService.getEmployeeDocuments(employeeId);
  }

  @Post(':employeeId/documents')
  async createDocument(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    return this.employeesService.createDocument(employeeId, createDocumentDto);
  }
}
