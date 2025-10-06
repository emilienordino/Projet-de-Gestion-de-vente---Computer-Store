import { ActionAudit, Audit, PrismaClient } from '@prisma/client';

export class AuditService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createAudit(data: {
    id_utilisateur: string;
    table_affectee: string;
    action: ActionAudit;
    details?: any;
    ip_adresse: string;
    device_info?: string;
  }): Promise<Audit> {
    return this.prisma.audit.create({
      data: {
        id_utilisateur: data.id_utilisateur,
        table_affectee: data.table_affectee,
        action: data.action,
        details: data.details ? JSON.parse(JSON.stringify(data.details)) : null,
        ip_adresse: data.ip_adresse,
        device_info: data.device_info
      },
      include: {
        utilisateur: true
      }
    });
  }

  async getAllAudits(): Promise<Audit[]> {
    return this.prisma.audit.findMany({
      include: {
        utilisateur: true
      },
      orderBy: { date_action: 'desc' }
    });
  }

  async getAuditById(id: string): Promise<Audit> {
    const audit = await this.prisma.audit.findUnique({
      where: { id_audit: id },
      include: {
        utilisateur: true
      }
    });
    if (!audit) {
      throw new Error('Audit non trouvé');
    }
    return audit;
  }

  async getAuditsByUser(idUtilisateur: string): Promise<Audit[]> {
    return this.prisma.audit.findMany({
      where: { id_utilisateur: idUtilisateur },
      include: {
        utilisateur: true
      },
      orderBy: { date_action: 'desc' }
    });
  }

  async getAuditsByTable(table: string): Promise<Audit[]> {
    return this.prisma.audit.findMany({
      where: { table_affectee: table },
      include: {
        utilisateur: true
      },
      orderBy: { date_action: 'desc' }
    });
  }

  async getAuditsByAction(action: ActionAudit): Promise<Audit[]> {
    return this.prisma.audit.findMany({
      where: { action },
      include: {
        utilisateur: true
      },
      orderBy: { date_action: 'desc' }
    });
  }

  async getAuditsPeriode(debut: Date, fin: Date): Promise<Audit[]> {
    return this.prisma.audit.findMany({
      where: {
        date_action: {
          gte: debut,
          lte: fin
        }
      },
      include: {
        utilisateur: true
      },
      orderBy: { date_action: 'desc' }
    });
  }

  async getStatsAudits(): Promise<{
    totalAudits: number;
    parAction: { action: ActionAudit; count: number }[];
    parTable: { table: string; count: number }[];
    parUtilisateur: { utilisateur: string; count: number }[];
  }> {
    const [total, parAction, parTable, parUtilisateur] = await Promise.all([
      this.prisma.audit.count(),
      this.prisma.audit.groupBy({
        by: ['action'],
        _count: true
      }),
      this.prisma.audit.groupBy({
        by: ['table_affectee'],
        _count: true
      }),
      this.prisma.audit.groupBy({
        by: ['id_utilisateur'],
        _count: true,
        orderBy: { _count: { id_utilisateur: 'desc' } },
        take: 10
      })
    ]);

    return {
      totalAudits: total,
      parAction: parAction.map(a => ({ action: a.action, count: a._count })),
      parTable: parTable.map(t => ({ table: t.table_affectee, count: t._count })),
      parUtilisateur: parUtilisateur.map(u => ({ 
        utilisateur: u.id_utilisateur, 
        count: u._count 
      }))
    };
  }

  async deleteOldAudits(joursAConserver: number): Promise<number> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - joursAConserver);

    const result = await this.prisma.audit.deleteMany({
      where: {
        date_action: {
          lt: dateLimit
        }
      }
    });

    return result.count;
  }
}