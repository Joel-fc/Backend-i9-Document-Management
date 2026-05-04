import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(createProjectDto: CreateProjectDto) {
    const { title, description, imageUrl, employeeIds } = createProjectDto;

    try {
      const project = await this.prisma.$transaction(async (prisma) => {
        // Create the project
        const newProject = await prisma.project.create({
          data: {
            title,
            description,
            imageUrl,
          },
        });

        // If there are employees to link, create the relations in the pivot table
        if (employeeIds && employeeIds.length > 0) {
          const projectEmployeesData = employeeIds.map(employeeId => ({
            projectId: newProject.id,
            employeeId,
          }));

          await prisma.projectEmployee.createMany({
            data: projectEmployeesData,
          });
        }

        // Return the project with its linked employees
        return prisma.project.findUnique({
          where: { id: newProject.id },
          include: {
            employees: {
              include: {
                employee: true
              }
            }
          }
        });
      });

      return project;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar o projeto e vincular os colaboradores');
    }
  }

  async findProjectById(id: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: {
          users: { include: { user: { select: { id: true, name: true, email: true, }, }, }, }, employees: { include: { employee: true, }, }, },
      });

      if (!project) {
        throw new NotFoundException(`Projeto com ID ${id} não encontrado`);
      }

      return {
        ...project,
        users: project.users.map(pu => pu.user), employees: project.employees ? project.employees.map(pe => pe.employee) : [], };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar detalhes do projeto');
    }
  }

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
  async linkEmployeesToProject(projectId: string, employeeIds: string[]) {
    // 1. Verifica se o projeto existe
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Projeto com ID ${projectId} não encontrado`);
    }

    // 2. Verifica se os funcionários existem
    const employees = await this.prisma.employee.findMany({
      where: { id: { in: employeeIds } },
    });

    // Se a quantidade não for igual, é porque algum ID é solto/falso
    if (employees.length !== employeeIds.length) {
      throw new NotFoundException('Um ou mais colaboradores fornecidos não foram encontrados.');
    }

    // 3. Busca links que já existem para este projeto para evitar duplicações
    const existingLinks = await this.prisma.projectEmployee.findMany({
      where: {
        projectId,
        employeeId: { in: employeeIds },
      },
    });

    const existingEmployeeIds = existingLinks.map((link) => link.employeeId);
    
    // 4. Filtra somente aqueles IDs que AINDA NÃO ESTÃO vinculados
    const newEmployeeIds = employeeIds.filter(id => !existingEmployeeIds.includes(id));

    if (newEmployeeIds.length === 0) {
      return { message: 'Todos os colaboradores listados já estão vinculados a este projeto.' };
    }

    // 5. Cadastra no banco de dados na Tabela Pivô
    const projectEmployeesData = newEmployeeIds.map(employeeId => ({
      projectId,
      employeeId,
    }));

    try {
      await this.prisma.projectEmployee.createMany({
        data: projectEmployeesData,
        skipDuplicates: true, // Segurança a nível de BD no Postgres/Prisma
      });

      return { 
        message: 'Colaboradores vinculados com sucesso', 
        vinculados: newEmployeeIds 
      };
    } catch (error) {
      throw new InternalServerErrorException('Falha interna ao tentar salvar vínculo na base de dados.');
    }
  }}