import { PrismaClient, ProjectStatus } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Iniciando o seed de projetos...')

  const projects = [
    {
      title: 'Sistema de Correias Transportadoras - Porto Sul',
      description: 'Engenharia e montagem de sistema modular para transporte de minério de ferro com capacidade de 2000t/h.',
      status: ProjectStatus.COMPLETED,
      imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800',
    },
    {
      title: 'Terminal de Armazenamento de Combustíveis',
      description: 'Projeto de tanques verticais e tubulações para manuseio de líquidos inflamáveis em parque industrial.',
      status: ProjectStatus.IN_PROGRESS,
      imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=800',
    },
    {
      title: 'Moega Modular para Fertilizantes',
      description: 'Solução personalizada para recepção de fertilizantes granulados com sistema de despoeiramento integrado.',
      status: ProjectStatus.PLANNING,
      imageUrl: 'https://images.unsplash.com/photo-1541933017631-030a27361732?q=80&w=800',
    },
    {
      title: 'Silo de Grãos Automatizado - Mato Grosso',
      description: 'Desenvolvimento de silos de 50.000 sacas com monitoramento térmico e tecnologia de aeração avançada.',
      status: ProjectStatus.COMPLETED,
      imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800',
    },
    {
      title: 'Linha de Beneficiamento de Cimento',
      description: 'Reforma e modernização da linha de britagem e ensaque de cimento para aumento de eficiência produtiva.',
      status: ProjectStatus.IN_PROGRESS,
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',
    },
    {
      title: 'Terminal Químico de Óleos Vegetais',
      description: 'Implantação de sistema de bombeamento e filtragem para manuseio de óleos vegetais destinados à exportação.',
      status: ProjectStatus.PLANNING,
      imageUrl: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?q=80&w=800',
    },
    // Adicionando mais alguns para testar a paginação (total > 9)
    {
      title: 'Elevador de Caçambas Industrial',
      description: 'Equipamento robusto para transporte vertical de sólidos de alta densidade.',
      status: ProjectStatus.COMPLETED,
      imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800',
    },
    {
      title: 'Plataforma de Descarga de Caminhões',
      description: 'Sistema hidráulico de tombamento para rápida descarga de granéis sólidos.',
      status: ProjectStatus.IN_PROGRESS,
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800',
    },
    {
      title: 'Filtro de Mangas para Mineração',
      description: 'Solução de engenharia ambiental para controle de particulados em áreas críticas.',
      status: ProjectStatus.COMPLETED,
      imageUrl: 'https://images.unsplash.com/photo-1535551951406-a199ec026e7a?q=80&w=800',
    },
    {
      title: 'Painéis de Automação Industrial',
      description: 'Desenvolvimento de tecnologia para controle modular de fluxos de líquidos e sólidos.',
      status: ProjectStatus.PLANNING,
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=800',
    },
    {
      title: 'Reforma de Silos Marítimos',
      description: 'Manutenção estrutural e tecnológica em terminais portuários de grande porte.',
      status: ProjectStatus.CANCELED,
      imageUrl: 'https://images.unsplash.com/photo-1590496793907-422cc47726e6?q=80&w=800',
    },
    {
      title: 'Sistema de Pesagem em Fluxo',
      description: 'Balanças integradas às correias transportadoras para controle preciso de inventário.',
      status: ProjectStatus.COMPLETED,
      imageUrl: 'https://images.unsplash.com/photo-1517420162741-24823930ee45?q=80&w=800',
    },
  ]

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    })
  }

  console.log('Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })