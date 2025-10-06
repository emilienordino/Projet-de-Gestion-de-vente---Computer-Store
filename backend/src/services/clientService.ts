import { Client, Prisma, PrismaClient } from '@prisma/client';
import { AuditService } from './auditService';

export class ClientService {
  private prisma: PrismaClient;
  private auditService: AuditService;

  constructor() {
    this.prisma = new PrismaClient();
    this.auditService = new AuditService();
  }

  private async generateUniqueClientCode(): Promise<string> {
    let isUnique = false;
    let code = '';
    
    while (!isUnique) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      code = `CLT-${timestamp}${random}`;
      
      const existing = await this.prisma.client.findUnique({
        where: { code_client: code }
      });
      
      if (!existing) {
        isUnique = true;
      }
    }
    
    return code;
  }

  async getAll(): Promise<Client[]> {
    return await this.prisma.client.findMany({
      where: { supprime: false },
      orderBy: { date_creation: 'desc' }
    });
  }

  async getById(id: string): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { id_client: id } });
    if (!client) throw new Error('Client non trouvé');
    return client;
  }

  async getByCode(code: string): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { code_client: code } });
    if (!client) throw new Error('Client avec ce code non trouvé');
    return client;
  }

  async create(input: Prisma.ClientCreateInput, auditInfo?: { id_utilisateur: string; ip_adresse: string }): Promise<Client> {
    try {
      const existingPhone = await this.prisma.client.findFirst({ where: { telephone: input.telephone } });
      if (existingPhone) throw new Error('Un client avec ce téléphone existe déjà');

      if (input.email) {
        const existingEmail = await this.prisma.client.findFirst({ where: { email: input.email } });
        if (existingEmail) throw new Error('Un client avec cet email existe déjà');
      }

      const code = await this.generateUniqueClientCode();
      const client = await this.prisma.client.create({ 
        data: { ...input, code_client: code }
      });

      if (auditInfo) {
        await this.auditService.createAudit({
          id_utilisateur: auditInfo.id_utilisateur,
          table_affectee: 'clients',
          action: 'CREATE',
          details: { 
            client_id: client.id_client,
            code_client: client.code_client,
            nom: client.nom,
            telephone: client.telephone
          },
          ip_adresse: auditInfo.ip_adresse
        });
      }

      return client;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async update(id: string, input: Prisma.ClientUpdateInput, auditInfo?: { id_utilisateur: string; ip_adresse: string }): Promise<Client> {
    try {
      const client = await this.prisma.client.findUnique({ where: { id_client: id } });
      if (!client) throw new Error('Client non trouvé');

      if (input.telephone) {
        const existingPhone = await this.prisma.client.findFirst({
          where: { telephone: input.telephone as string, id_client: { not: id } }
        });
        if (existingPhone) throw new Error('Un client avec ce téléphone existe déjà');
      }

      if (input.email) {
        const existingEmail = await this.prisma.client.findFirst({
          where: { email: input.email as string, id_client: { not: id } }
        });
        if (existingEmail) throw new Error('Un client avec cet email existe déjà');
      }

      const updatedClient = await this.prisma.client.update({ where: { id_client: id }, data: input });

      if (auditInfo) {
        await this.auditService.createAudit({
          id_utilisateur: auditInfo.id_utilisateur,
          table_affectee: 'clients',
          action: 'UPDATE',
          details: { 
            client_id: id,
            modifications: input
          },
          ip_adresse: auditInfo.ip_adresse
        });
      }

      return updatedClient;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async supprimer(id: string, auditInfo?: { id_utilisateur: string; ip_adresse: string }): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { id_client: id } });
    if (!client) throw new Error('Client non trouvé');

    const deletedClient = await this.prisma.client.update({
      where: { id_client: id },
      data: { supprime: true }
    });

    if (auditInfo) {
      await this.auditService.createAudit({
        id_utilisateur: auditInfo.id_utilisateur,
        table_affectee: 'clients',
        action: 'DELETE',
        details: { 
          client_id: id,
          code_client: client.code_client,
          nom: client.nom
        },
        ip_adresse: auditInfo.ip_adresse
      });
    }

    return deletedClient;
  }

  async search(params: { nom?: string; telephone?: string }): Promise<Client[]> {
    const where: Prisma.ClientWhereInput = { supprime: false };
    
    if (params.nom) {
      where.OR = [
        { nom: { contains: params.nom } },
        { prenom: { contains: params.nom } }
      ];
    }
    
    if (params.telephone) {
      where.telephone = { contains: params.telephone };
    }

    return await this.prisma.client.findMany({ where });
  }

  async getActifs(): Promise<Client[]> {
    return await this.prisma.client.findMany({ where: { supprime: false } });
  }

  async getSupprimes(): Promise<Client[]> {
    return await this.prisma.client.findMany({ where: { supprime: true } });
  }

  async getHistoriqueVentes(id: string): Promise<any[]> {
    return await this.prisma.vente.findMany({
      where: { id_client: id },
      include: { lignes_vente: { include: { produit: true } } },
      orderBy: { date_vente: 'desc' }
    });
  }

  async getStatsClient(id: string): Promise<{
    totalVentes: number;
    montantTotal: number;
    derniereVente: any;
  }> {
    const totalVentes = await this.prisma.vente.count({ where: { id_client: id } });
    const montantTotal = await this.prisma.vente.aggregate({
      where: { id_client: id },
      _sum: { total_net: true }
    });

    return {
      totalVentes,
      montantTotal: Number(montantTotal._sum.total_net) || 0,
      derniereVente: await this.prisma.vente.findFirst({
        where: { id_client: id },
        orderBy: { date_vente: 'desc' }
      })
    };
  }

  async restaurer(id: string, auditInfo?: { id_utilisateur: string; ip_adresse: string }): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { id_client: id } });
    if (!client) throw new Error('Client non trouvé');
    if (!client.supprime) throw new Error('Client déjà actif');

    const restoredClient = await this.prisma.client.update({
      where: { id_client: id },
      data: { supprime: false }
    });

    if (auditInfo) {
      await this.auditService.createAudit({
        id_utilisateur: auditInfo.id_utilisateur,
        table_affectee: 'clients',
        action: 'RESTORE',
        details: { 
          client_id: id,
          code_client: client.code_client,
          nom: client.nom
        },
        ip_adresse: auditInfo.ip_adresse
      });
    }
    
    return restoredClient;
  }
}