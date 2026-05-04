import { PrismaClient, ProjectStatus } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
import * as bcrypt from 'bcrypt'

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.document.deleteMany()
  await prisma.projectEmployee.deleteMany()
  await prisma.projectUser.deleteMany()
  await prisma.project.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('senha123', 10)

  const user1 = await prisma.user.create({
    data: {
      name: 'Carlos Almeida - Engenheiro Civil',
      email: 'carlos.almeida@i9tmg.com.br',
      password: hashedPassword,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Mariana Costa - Técnica de Segurança',
      email: 'mariana.costa@i9tmg.com.br',
      password: hashedPassword,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'Roberto Fernandes - Montador',
      email: 'roberto.fernandes@i9tmg.com.br',
      password: hashedPassword,
    },
  })

  await prisma.document.createMany({
    data: [
      {
        name: 'Certificado NR-35 (Trabalho em Altura)',
        fileUrl: 'https://ixkwnjzznxsz.supabase.co/storage/v1/object/public/documents/nr35-carlos.pdf',
        userId: user1.id,
      },
      {
        name: 'Atestado de Saúde Ocupacional (ASO)',
        fileUrl: 'https://ixkwnjzznxsz.supabase.co/storage/v1/object/public/documents/aso-mariana.pdf',
        userId: user2.id,
      },
      {
        name: 'Treinamento de Integração',
        fileUrl: 'https://ixkwnjzznxsz.supabase.co/storage/v1/object/public/documents/integracao-roberto.pdf',
        userId: user3.id,
      },
      // 20 Documentos Fictícios extras para testes
      ...Array.from({ length: 10 }).map((_, i) => ({
        name: `Relatório de Inspeção Mensal #${i + 1}`,
        fileUrl: `https://ixkwnjzznxsz.supabase.co/storage/v1/object/public/documents/relatorio-carlos-${i}.pdf`,
        userId: user1.id,
      })),
      ...Array.from({ length: 5 }).map((_, i) => ({
        name: `Análise de Risco de Ambiente #${i + 1}`,
        fileUrl: `https://ixkwnjzznxsz.supabase.co/storage/v1/object/public/documents/risco-mariana-${i}.pdf`,
        userId: user2.id,
      })),
      ...Array.from({ length: 5 }).map((_, i) => ({
        name: `Certificado de Calibração de Equipamento #${i + 1}`,
        fileUrl: `https://ixkwnjzznxsz.supabase.co/storage/v1/object/public/documents/calibracao-roberto-${i}.pdf`,
        userId: user3.id,
      })),
    ],
  })

  const proj1 = await prisma.project.create({
    data: {
      title: 'Montagem de Linha de Ensaque',
      description: 'Projeto de instalação e montagem completa de equipamentos para nova linha de ensaque automatizada.',
      clientName: 'Indústria Química Beta',
      status: ProjectStatus.IN_PROGRESS,
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-06-20'),
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',
      users: {
        create: [
          { userId: user1.id }, // Vincula Engenheiro
          { userId: user3.id }, // Vincula Montador
        ],
      },
    },
  })

  const proj2 = await prisma.project.create({
    data: {
      title: 'Manutenção de Tanques de Combustível',
      description: 'Parada programada para manutenção preventiva e corretiva nos tanques de armazenamento de diesel.',
      clientName: 'Refinaria PetroMax',
      status: ProjectStatus.PLANNING,
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-08-15'),
      imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=800',
      users: {
        create: [
          { userId: user1.id }, // Vincula Engenheiro
          { userId: user2.id }, // Vincula Técnica de Segurança
        ],
      },
    },
  })

  // Criar funcionários fictícios
  await prisma.employee.createMany({
    data: [
      { name: 'João Silva', role: 'Soldador' },
      { name: 'Ana Paula', role: 'Inspetora de Qualidade' },
      { name: 'Lucas Mendes', role: 'Eletricista' },
      { name: 'Fernando Souza', role: 'Ajudante Geral' },
      { name: 'Camila Rocha', role: 'Segurança do Trabalho' },
    ]
  })
}

main()
  .catch((e) => {
    console.error('Erro crítico durante a execução do seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
