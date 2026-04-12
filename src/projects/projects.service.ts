import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProjects(page: number = 1) {
    try {
      const limit = 9;
      const skip = (page - 1) * limit;

      // Executa as duas operações em uma única transação de banco
      const [projects, total] = await this.prisma.$transaction([
        this.prisma.project.findMany({
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.project.count(),
      ]);

      return {
        projects,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      };
    } catch (error) {
      // No NestJS, usamos exceções integradas para erros
      throw new InternalServerErrorException('Erro ao buscar projetos no banco de dados');
    }
  }
}