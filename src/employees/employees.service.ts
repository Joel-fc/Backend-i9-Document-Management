import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.employee.findMany();
  }

  async getEmployeeDocuments(employeeId: string) {
    try {
      const employeeExists = await this.prisma.employee.findUnique({
        where: { id: employeeId },
      });

      if (!employeeExists) {
        throw new NotFoundException(`Colaborador não encontrado`);
      }

      const documents = await this.prisma.document.findMany({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
      });

      return {
        employee: {
          id: employeeExists.id,
          name: employeeExists.name,
          role: employeeExists.role,
        },
        documents,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar documentos do colaborador');
    }
  }

  async createDocument(employeeId: string, dto: CreateDocumentDto) {
    const employeeExists = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employeeExists) {
      throw new NotFoundException(`Colaborador não encontrado`);
    }

    try {
      const document = await this.prisma.document.create({
        data: {
          name: dto.name,
          fileUrl: dto.fileUrl,
          employee: { connect: { id: employeeId } },
        },
      });

      return document;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar o documento');
    }
  }
}
