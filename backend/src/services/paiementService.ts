import { ModePaiement, Paiement, PrismaClient, StatutPaiement } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class PaiementService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async generateUniqueNumeroPaiement(): Promise<string> {
    let isUnique = false;
    let numero = '';
    
    while (!isUnique) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      numero = `PAY-${timestamp}${random}`;
      
      const existing = await this.prisma.paiement.findUnique({
        where: { numero_paiement: numero }
      });
      
      if (!existing) {
        isUnique = true;
      }
    }
    
    return numero;
  }

  async getAllPaiements(): Promise<Paiement[]> {
    return this.prisma.paiement.findMany({
      include: {
        vente: {
          include: {
            client: true,
            caissier: true
          }
        }
      },
      orderBy: { date_paiement: 'desc' }
    });
  }

  async getPaiementById(id: string): Promise<Paiement> {
    const paiement = await this.prisma.paiement.findUnique({
      where: { id_paiement: id },
      include: {
        vente: {
          include: {
            client: true,
            caissier: true
          }
        }
      }
    });
    if (!paiement) {
      throw new Error('Paiement non trouvé');
    }
    return paiement;
  }

  async getPaiementsByVente(idVente: string): Promise<Paiement[]> {
    const vente = await this.prisma.vente.findUnique({
      where: { id_vente: idVente }
    });
    if (!vente) {
      throw new Error('Vente non trouvée');
    }

    return this.prisma.paiement.findMany({
      where: { id_vente: idVente },
      orderBy: { date_paiement: 'desc' }
    });
  }

  async getPaiementsByMode(mode: ModePaiement): Promise<Paiement[]> {
    return this.prisma.paiement.findMany({
      where: { mode_paiement: mode },
      include: {
        vente: {
          include: {
            client: true,
            caissier: true
          }
        }
      },
      orderBy: { date_paiement: 'desc' }
    });
  }

  async getPaiementsPeriode(debut: Date, fin: Date): Promise<Paiement[]> {
    return this.prisma.paiement.findMany({
      where: {
        date_paiement: {
          gte: debut,
          lte: fin
        }
      },
      include: {
        vente: {
          include: {
            client: true,
            caissier: true
          }
        }
      },
      orderBy: { date_paiement: 'desc' }
    });
  }

  async createPaiement(data: {
    id_vente: string;
    date_paiement: Date;
    montant: Decimal;
    mode_paiement: ModePaiement;
    reference?: string;
    commentaire?: string;
  }): Promise<Paiement> {
    // Vérifier que la vente existe
    const vente = await this.prisma.vente.findUnique({
      where: { id_vente: data.id_vente },
      include: {
        paiements: true
      }
    });

    if (!vente) {
      throw new Error('Vente non trouvée');
    }

    // Vérifier le statut de la vente
    if (vente.statut_vente === 'ANNULEE') {
      throw new Error('Impossible d\'ajouter un paiement à une vente annulée');
    }

    if (vente.statut_vente === 'REMBOURSEE') {
      throw new Error('Impossible d\'ajouter un paiement à une vente remboursée');
    }

    // Vérifier que le montant est positif
    if (data.montant.lessThanOrEqualTo(0)) {
      throw new Error('Le montant du paiement doit être supérieur à zéro');
    }

    // Calculer le total déjà payé
    const totalPaye = vente.paiements.reduce((sum, p) => {
      if (p.statut_paiement === 'VALIDE') {
        return sum.plus(p.montant);
      }
      return sum;
    }, new Decimal(0));

    // Vérifier que le montant ne dépasse pas le total restant
    const restant = vente.total_net.minus(totalPaye);
    if (data.montant.greaterThan(restant)) {
      throw new Error(`Le montant dépasse le restant dû. Restant: ${restant.toString()}, Montant saisi: ${data.montant.toString()}`);
    }

    // Générer le numéro de paiement
    const numero_paiement = await this.generateUniqueNumeroPaiement();

    const paiement = await this.prisma.paiement.create({
      data: {
        id_vente: data.id_vente,
        date_paiement: data.date_paiement,
        montant: data.montant,
        mode_paiement: data.mode_paiement,
        numero_paiement,
        reference: data.reference,
        commentaire: data.commentaire,
        statut_paiement: 'VALIDE'
      },
      include: {
        vente: true
      }
    });

    // Mettre à jour le statut de la vente si totalement payée
    const nouveauTotalPaye = totalPaye.plus(data.montant);
    if (nouveauTotalPaye.greaterThanOrEqualTo(vente.total_net)) {
      await this.prisma.vente.update({
        where: { id_vente: data.id_vente },
        data: { statut_vente: 'PAYEE' }
      });
    } else if (vente.statut_vente === 'COMMANDE') {
      await this.prisma.vente.update({
        where: { id_vente: data.id_vente },
        data: { statut_vente: 'EN_COURS' }
      });
    }

    return paiement;
  }

  async updatePaiement(id: string, data: {
    date_paiement?: Date;
    montant?: Decimal;
    mode_paiement?: ModePaiement;
    reference?: string;
    commentaire?: string;
  }): Promise<Paiement> {
    const paiement = await this.prisma.paiement.findUnique({
      where: { id_paiement: id },
      include: { vente: true }
    });

    if (!paiement) {
      throw new Error('Paiement non trouvé');
    }

    if (paiement.statut_paiement === 'REFUSE') {
      throw new Error('Impossible de modifier un paiement refusé');
    }

    if (paiement.vente.statut_vente === 'ANNULEE') {
      throw new Error('Impossible de modifier un paiement d\'une vente annulée');
    }

    if (data.montant !== undefined && data.montant.lessThanOrEqualTo(0)) {
      throw new Error('Le montant doit être supérieur à zéro');
    }

    return this.prisma.paiement.update({
      where: { id_paiement: id },
      data,
      include: {
        vente: true
      }
    });
  }

  async changerStatutPaiement(id: string, statut: StatutPaiement): Promise<Paiement> {
    const paiement = await this.prisma.paiement.findUnique({
      where: { id_paiement: id },
      include: { vente: true }
    });

    if (!paiement) {
      throw new Error('Paiement non trouvé');
    }

    return this.prisma.paiement.update({
      where: { id_paiement: id },
      data: { statut_paiement: statut },
      include: { vente: true }
    });
  }

  async validerPaiement(id: string): Promise<Paiement> {
    return this.changerStatutPaiement(id, 'VALIDE');
  }

  async refuserPaiement(id: string): Promise<Paiement> {
    return this.changerStatutPaiement(id, 'REFUSE');
  }

  async deletePaiement(id: string): Promise<Paiement> {
    const paiement = await this.prisma.paiement.findUnique({
      where: { id_paiement: id },
      include: { vente: true }
    });

    if (!paiement) {
      throw new Error('Paiement non trouvé');
    }

    if (paiement.vente.statut_vente === 'PAYEE') {
      throw new Error('Impossible de supprimer un paiement d\'une vente déjà payée');
    }

    return this.prisma.paiement.delete({
      where: { id_paiement: id }
    });
  }

  async getStatsPaiements(): Promise<{
    totalPaiements: number;
    montantTotal: Decimal;
    parMode: { mode: ModePaiement; total: Decimal; count: number }[];
  }> {
    const [count, sum, groupByMode] = await Promise.all([
      this.prisma.paiement.count({ where: { statut_paiement: 'VALIDE' } }),
      this.prisma.paiement.aggregate({
        where: { statut_paiement: 'VALIDE' },
        _sum: { montant: true }
      }),
      this.prisma.paiement.groupBy({
        by: ['mode_paiement'],
        where: { statut_paiement: 'VALIDE' },
        _sum: { montant: true },
        _count: true
      })
    ]);

    return {
      totalPaiements: count,
      montantTotal: sum._sum.montant || new Decimal(0),
      parMode: groupByMode.map(g => ({
        mode: g.mode_paiement,
        total: g._sum.montant || new Decimal(0),
        count: g._count
      }))
    };
  }
}