import { Facture, PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class FactureService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async generateUniqueNumeroFacture(): Promise<string> {
    let isUnique = false;
    let numero = '';
    
    while (!isUnique) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      numero = `FACT-${timestamp}${random}`;
      
      const existing = await this.prisma.facture.findUnique({
        where: { numero_facture: numero }
      });
      
      if (!existing) {
        isUnique = true;
      }
    }
    
    return numero;
  }

  async getAllFactures(): Promise<Facture[]> {
    return this.prisma.facture.findMany({
      include: {
        vente: {
          include: {
            client: true,
            caissier: true,
            lignes_vente: {
              include: {
                produit: true
              }
            }
          }
        }
      },
      orderBy: { date_emission: 'desc' }
    });
  }

  async getFactureById(id: string): Promise<Facture> {
    const facture = await this.prisma.facture.findUnique({
      where: { id_facture: id },
      include: {
        vente: {
          include: {
            client: true,
            caissier: true,
            lignes_vente: {
              include: {
                produit: true
              }
            },
            paiements: true
          }
        }
      }
    });
    if (!facture) {
      throw new Error('Facture non trouvée');
    }
    return facture;
  }

  async getFactureByNumero(numero: string): Promise<Facture> {
    const facture = await this.prisma.facture.findUnique({
      where: { numero_facture: numero },
      include: {
        vente: {
          include: {
            client: true,
            caissier: true,
            lignes_vente: {
              include: {
                produit: true
              }
            },
            paiements: true
          }
        }
      }
    });
    if (!facture) {
      throw new Error('Facture avec ce numéro non trouvée');
    }
    return facture;
  }

  async getFactureByVente(idVente: string): Promise<Facture> {
    const facture = await this.prisma.facture.findUnique({
      where: { id_vente: idVente },
      include: {
        vente: {
          include: {
            client: true,
            caissier: true,
            lignes_vente: {
              include: {
                produit: true
              }
            },
            paiements: true
          }
        }
      }
    });
    if (!facture) {
      throw new Error('Aucune facture trouvée pour cette vente');
    }
    return facture;
  }

  async getFacturesPeriode(debut: Date, fin: Date): Promise<Facture[]> {
    return this.prisma.facture.findMany({
      where: {
        date_emission: {
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
      orderBy: { date_emission: 'desc' }
    });
  }

  async createFacture(idVente: string): Promise<Facture> {
    // Vérifier que la vente existe
    const vente = await this.prisma.vente.findUnique({
      where: { id_vente: idVente },
      include: {
        facture: true,
        lignes_vente: true
      }
    });

    if (!vente) {
      throw new Error('Vente non trouvée');
    }

    // Vérifier qu'une facture n'existe pas déjà
    if (vente.facture) {
      throw new Error('Une facture existe déjà pour cette vente');
    }

    // Vérifier que la vente a des lignes
    if (vente.lignes_vente.length === 0) {
      throw new Error('Impossible de générer une facture pour une vente sans lignes');
    }

    // Vérifier le statut de la vente
    if (vente.statut_vente === 'ANNULEE') {
      throw new Error('Impossible de générer une facture pour une vente annulée');
    }

    // Générer le numéro de facture
    const numero_facture = await this.generateUniqueNumeroFacture();

    return this.prisma.facture.create({
      data: {
        id_vente: idVente,
        numero_facture,
        date_emission: new Date(),
        montant_total: vente.total_net,
        statut_facture: 'GENEREE',
        pdf_url: `factures/${numero_facture}.pdf`
      },
      include: {
        vente: {
          include: {
            client: true,
            caissier: true,
            lignes_vente: {
              include: {
                produit: true
              }
            },
            paiements: true
          }
        }
      }
    });
  }

  async updateFacture(id: string, data: {
    date_emission?: Date;
    montant_total?: Decimal;
    pdf_url?: string;
  }): Promise<Facture> {
    const facture = await this.prisma.facture.findUnique({
      where: { id_facture: id }
    });

    if (!facture) {
      throw new Error('Facture non trouvée');
    }

    if (facture.statut_facture === 'ANNULEE') {
      throw new Error('Impossible de modifier une facture annulée');
    }

    if (data.montant_total !== undefined && data.montant_total.lessThanOrEqualTo(0)) {
      throw new Error('Le montant total doit être supérieur à zéro');
    }

    return this.prisma.facture.update({
      where: { id_facture: id },
      data,
      include: {
        vente: {
          include: {
            client: true,
            caissier: true,
            lignes_vente: {
              include: {
                produit: true
              }
            }
          }
        }
      }
    });
  }

  async annulerFacture(id: string): Promise<Facture> {
    const facture = await this.prisma.facture.findUnique({
      where: { id_facture: id },
      include: { vente: true }
    });

    if (!facture) {
      throw new Error('Facture non trouvée');
    }

    if (facture.statut_facture === 'ANNULEE') {
      throw new Error('Cette facture est déjà annulée');
    }

    if (facture.vente.statut_vente === 'PAYEE') {
      throw new Error('Impossible d\'annuler une facture d\'une vente payée');
    }

    return this.prisma.facture.update({
      where: { id_facture: id },
      data: { statut_facture: 'ANNULEE' },
      include: {
        vente: true
      }
    });
  }

  async deleteFacture(id: string): Promise<Facture> {
    const facture = await this.prisma.facture.findUnique({
      where: { id_facture: id },
      include: { vente: true }
    });

    if (!facture) {
      throw new Error('Facture non trouvée');
    }

    if (facture.vente.statut_vente === 'PAYEE') {
      throw new Error('Impossible de supprimer une facture d\'une vente payée');
    }

    return this.prisma.facture.delete({
      where: { id_facture: id }
    });
  }

  async regenererPDF(id: string): Promise<Facture> {
    const facture = await this.prisma.facture.findUnique({
      where: { id_facture: id }
    });

    if (!facture) {
      throw new Error('Facture non trouvée');
    }

    if (facture.statut_facture === 'ANNULEE') {
      throw new Error('Impossible de régénérer le PDF d\'une facture annulée');
    }

    const nouveauPdfUrl = `factures/${facture.numero_facture}_${Date.now()}.pdf`;

    return this.prisma.facture.update({
      where: { id_facture: id },
      data: { pdf_url: nouveauPdfUrl },
      include: {
        vente: {
          include: {
            client: true,
            caissier: true,
            lignes_vente: {
              include: {
                produit: true
              }
            }
          }
        }
      }
    });
  }

  async getStatsFactures(): Promise<{
    totalFactures: number;
    montantTotal: Decimal;
    facturesTotales: number;
    facturesAnnulees: number;
  }> {
    const [totalFactures, montantSum, facturesTotales, facturesAnnulees] = await Promise.all([
      this.prisma.facture.count(),
      this.prisma.facture.aggregate({
        where: { statut_facture: 'GENEREE' },
        _sum: { montant_total: true }
      }),
      this.prisma.facture.count({ where: { statut_facture: 'GENEREE' } }),
      this.prisma.facture.count({ where: { statut_facture: 'ANNULEE' } })
    ]);

    return {
      totalFactures,
      montantTotal: montantSum._sum.montant_total || new Decimal(0),
      facturesTotales,
      facturesAnnulees
    };
  }
}