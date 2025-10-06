import { Facture, LigneVente, ModePaiement, Paiement, PrismaClient, StatutVente, Vente } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { LigneVenteService } from '../services/saleLineService';
import { FactureService } from './factureService';
import { PaiementService } from './paiementService';

export class VenteService {
  private prisma: PrismaClient;
  private ligneService: LigneVenteService;
  private paiementService: PaiementService;
  private factureService: FactureService;
  

  constructor() {
    this.prisma = new PrismaClient();
    this.ligneService = new LigneVenteService();
    this.paiementService = new PaiementService();
    this.factureService = new FactureService();
  }

  private async generateUniqueNumeroVente(): Promise<string> {
    let isUnique = false;
    let numero = '';
    
    while (!isUnique) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      numero = `VENT-${timestamp}${random}`;
      
      const existing = await this.prisma.vente.findUnique({
        where: { numero_vente: numero }
      });
      
      if (!existing) {
        isUnique = true;
      }
    }
    
    return numero;
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

  async getAllVentes(): Promise<Vente[]> { 
    return this.prisma.vente.findMany({
      include: { caissier: true, client: true, lignes_vente: true, paiements: true, facture: true }
    });
  }

  async getVenteById(id: string): Promise<Vente> {
    const vente = await this.prisma.vente.findUnique({
      where: { id_vente: id },
      include: { caissier: true, client: true, lignes_vente: true, paiements: true, facture: true }
    });
    if (!vente) throw new Error('Vente non trouvée');
    return vente;
  }

  async getVenteByNumero(numero: string): Promise<Vente> {
    const vente = await this.prisma.vente.findUnique({
      where: { numero_vente: numero },
      include: { caissier: true, client: true, lignes_vente: true, paiements: true, facture: true }
    });
    if (!vente) throw new Error('Vente non trouvée avec ce numéro');
    return vente;
  }

  async getVentesByStatut(statut: StatutVente): Promise<Vente[]> {
    return this.prisma.vente.findMany({
      where: { statut_vente: statut },
      include: { caissier: true, client: true, lignes_vente: true, paiements: true, facture: true }
    });
  }

  async createVente(data: {
    date_vente: Date;
    id_caissier: string;
    id_client?: string;
    total_brut: Decimal;
    remise_total?: Decimal;
    total_net: Decimal;
    statut_vente?: StatutVente;
    commentaire?: string;
  }): Promise<Vente> {
    // Validation métier avec Decimal
    if (data.total_net.lessThan(0) || data.total_brut.lessThan(0)) {
      throw new Error('Les montants ne peuvent pas être négatifs');
    }

    // Vérifier que le caissier existe
    const caissier = await this.prisma.utilisateur.findUnique({
      where: { id_utilisateur: data.id_caissier }
    });
    if (!caissier) {
      throw new Error('Caissier non trouvé');
    }

    // Vérifier que le client existe (si fourni)
    if (data.id_client) {
      const client = await this.prisma.client.findUnique({
        where: { id_client: data.id_client }
      });
      if (!client) {
        throw new Error('Client non trouvé');
      }
    }

    // Générer numero_vente unique
    const numero_vente = await this.generateUniqueNumeroVente();

    return this.prisma.vente.create({
      data: {
        numero_vente,
        date_vente: data.date_vente,
        id_caissier: data.id_caissier,
        id_client: data.id_client,
        total_brut: data.total_brut,
        remise_total: data.remise_total || new Decimal(0),
        total_net: data.total_net,
        statut_vente: data.statut_vente || 'COMMANDE',
        commentaire: data.commentaire
      },
      include: { 
        caissier: true, 
        client: true, 
        lignes_vente: { include: { produit: true } }, 
        paiements: true, 
        facture: true 
      }
    });
  }

  async updateVente(id: string, data: {
    date_vente?: Date;
    id_caissier?: string;
    id_client?: string;
    total_brut?: Decimal;
    remise_total?: Decimal;
    total_net?: Decimal;
    statut_vente?: StatutVente;
    commentaire?: string;
  }): Promise<Vente> {
    const vente = await this.prisma.vente.findUnique({ where: { id_vente: id } });
    if (!vente) throw new Error('Vente non trouvée');
    return this.prisma.vente.update({
      where: { id_vente: id },
      data,
      include: { caissier: true, client: true, lignes_vente: true, paiements: true, facture: true }
    });
  }

  async changerStatutVente(id: string, data: { statut_vente: StatutVente }): Promise<Vente> {
    const vente = await this.prisma.vente.findUnique({ where: { id_vente: id } });
    if (!vente) throw new Error('Vente non trouvée');
    return this.prisma.vente.update({
      where: { id_vente: id },
      data: { statut_vente: data.statut_vente },
      include: { caissier: true, client: true, lignes_vente: true, paiements: true, facture: true }
    });
  }

  async ajouterPaiement(id: string, data: {
    date_paiement: Date;
    montant: Decimal;
    mode_paiement: ModePaiement;
    reference?: string;
    commentaire?: string;
  }): Promise<Paiement> {
    return this.paiementService.createPaiement({ 
      ...data, 
      id_vente: id
    });
  }

  async rembourserVente(id: string, data: { montant: Decimal; commentaire?: string }): Promise<Vente> {
    const vente = await this.prisma.vente.findUnique({ where: { id_vente: id } });
    if (!vente) throw new Error('Vente non trouvée');
    return this.prisma.vente.update({
      where: { id_vente: id },
      data: { statut_vente: 'REMBOURSEE' }
    });
  }

  async annulerVente(id: string): Promise<Vente> {
    const vente = await this.prisma.vente.findUnique({ where: { id_vente: id } });
    if (!vente) throw new Error('Vente non trouvée');
    return this.prisma.vente.update({
      where: { id_vente: id },
      data: { statut_vente: 'ANNULEE' }
    });
  }

  async getLignesVente(id: string): Promise<LigneVente[]> {
    return this.ligneService.getLignesByVente(id);
  }

  async ajouterLigne(id: string, data: any): Promise<LigneVente> {
    return this.ligneService.createLigne({ ...data, id_vente: id });
  }

  async updateLigne(idVente: string, idLigne: string, data: any): Promise<LigneVente> {
    return this.ligneService.updateLigne(idLigne, data);
  }

  async supprimerLigne(idVente: string, idLigne: string): Promise<LigneVente> {
    return this.ligneService.deleteLigne(idLigne);
  }

  async getVentesPeriode(debut: Date, fin: Date): Promise<Vente[]> {
    return this.prisma.vente.findMany({
      where: { date_vente: { gte: debut, lte: fin } },
      include: { caissier: true, client: true, lignes_vente: true, paiements: true, facture: true }
    });
  }

  async getStatsVentes(): Promise<{ totalVentes: number; totalMontant: Decimal }> {
    const [count, sum] = await Promise.all([
      this.prisma.vente.count(),
      this.prisma.vente.aggregate({ _sum: { total_net: true } })
    ]);
    return { 
      totalVentes: count, 
      totalMontant: sum._sum.total_net || new Decimal(0) 
    };
  }

  async getVentesByCaissier(id: string): Promise<Vente[]> {
    return this.prisma.vente.findMany({
      where: { id_caissier: id },
      include: { caissier: true, client: true, lignes_vente: true, paiements: true, facture: true }
    });
  }

  async getVentesByClient(id: string): Promise<Vente[]> {
    return this.prisma.vente.findMany({
      where: { id_client: id },
      include: { caissier: true, client: true, lignes_vente: true, paiements: true, facture: true }
    });
  }

  async genererFacture(id: string): Promise<Facture> {
    return this.factureService.createFacture(id);
  }

  async exportVentes(): Promise<Vente[]> {
    return this.prisma.vente.findMany({
      include: { caissier: true, client: true, lignes_vente: true, paiements: true, facture: true }
    });
  }
}