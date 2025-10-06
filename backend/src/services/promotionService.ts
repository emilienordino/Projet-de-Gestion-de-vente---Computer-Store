import { PrismaClient, Promotion, TypeRemise } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class PromotionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async generateUniqueCodePromotion(): Promise<string> {
    let isUnique = false;
    let code = '';
    
    while (!isUnique) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      code = `PROMO-${timestamp}${random}`;
      
      const existing = await this.prisma.promotion.findUnique({
        where: { code_promotion: code }
      });
      
      if (!existing) {
        isUnique = true;
      }
    }
    
    return code;
  }

  async getAllPromotions(): Promise<Promotion[]> {
    return this.prisma.promotion.findMany({
      where: { supprime: false },
      include: { produit: true, categorie: true }
    });
  }

  async getPromotionById(id: string): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id_promotion: id, supprime: false },
      include: { produit: true, categorie: true }
    });
    if (!promotion) throw new Error('Promotion non trouvée');
    return promotion;
  }

  async getPromotionByCode(code: string): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { code_promotion: code, supprime: false },
      include: { produit: true, categorie: true }
    });
    if (!promotion) throw new Error('Promotion non trouvée avec ce code');
    return promotion;
  }

  async getPromotionsActives(): Promise<Promotion[]> {
    const now = new Date();
    return this.prisma.promotion.findMany({
      where: {
        supprime: false,
        date_debut: { lte: now },
        date_fin: { gte: now }
      },
      include: { produit: true, categorie: true }
    });
  }

  async getPromotionsByProduit(idProduit: string): Promise<Promotion[]> {
    return this.prisma.promotion.findMany({
      where: {
        id_produit: idProduit,
        supprime: false
      },
      include: { produit: true, categorie: true }
    });
  }

  async getPromotionsByCategorie(idCategorie: string): Promise<Promotion[]> {
    return this.prisma.promotion.findMany({
      where: {
        id_categorie: idCategorie,
        supprime: false
      },
      include: { produit: true, categorie: true }
    });
  }

  async createPromotion(data: {
    nom: string;
    code_promotion?: string;
    description?: string;
    type_promo: TypeRemise;
    valeur: Decimal;
    date_debut: Date;
    date_fin: Date;
    id_produit?: string;
    id_categorie?: string;
  }): Promise<Promotion> {
    // Validation métier
    if (data.valeur.lessThanOrEqualTo(0)) {
      throw new Error('La valeur de la promotion doit être positive');
    }

    if (data.type_promo === 'POURCENTAGE' && data.valeur.greaterThan(100)) {
      throw new Error('Le pourcentage ne peut pas dépasser 100');
    }

    if (data.date_debut >= data.date_fin) {
      throw new Error('La date de début doit être antérieure à la date de fin');
    }

    // Vérifier que produit ou catégorie existe si fourni
    if (data.id_produit) {
      const produit = await this.prisma.produit.findUnique({
        where: { id_produit: data.id_produit }
      });
      if (!produit) throw new Error('Produit non trouvé');
    }

    if (data.id_categorie) {
      const categorie = await this.prisma.categorieProduit.findUnique({
        where: { id_categorie: data.id_categorie }
      });
      if (!categorie) throw new Error('Catégorie non trouvée');
    }

    // Générer code_promotion unique si non fourni
    const code_promotion = data.code_promotion || await this.generateUniqueCodePromotion();

    return this.prisma.promotion.create({
      data: {
        nom: data.nom,
        code_promotion,
        description: data.description,
        type_promo: data.type_promo,
        valeur: data.valeur,
        date_debut: data.date_debut,
        date_fin: data.date_fin,
        id_produit: data.id_produit,
        id_categorie: data.id_categorie
      },
      include: { produit: true, categorie: true }
    });
  }

  async updatePromotion(id: string, data: {
    nom?: string;
    description?: string;
    type_promo?: TypeRemise;
    valeur?: Decimal;
    date_debut?: Date;
    date_fin?: Date;
    id_produit?: string;
    id_categorie?: string;
  }): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id_promotion: id, supprime: false }
    });
    if (!promotion) throw new Error('Promotion non trouvée');

    // Validation métier
    if (data.valeur && data.valeur.lessThanOrEqualTo(0)) {
      throw new Error('La valeur de la promotion doit être positive');
    }

    const typePromo = data.type_promo || promotion.type_promo;
    const valeur = data.valeur || promotion.valeur;
    if (typePromo === 'POURCENTAGE' && valeur.greaterThan(100)) {
      throw new Error('Le pourcentage ne peut pas dépasser 100');
    }

    const dateDebut = data.date_debut || promotion.date_debut;
    const dateFin = data.date_fin || promotion.date_fin;
    if (dateDebut >= dateFin) {
      throw new Error('La date de début doit être antérieure à la date de fin');
    }

    return this.prisma.promotion.update({
      where: { id_promotion: id },
      data,
      include: { produit: true, categorie: true }
    });
  }

  async supprimerPromotion(id: string): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id_promotion: id, supprime: false }
    });
    if (!promotion) throw new Error('Promotion non trouvée');

    return this.prisma.promotion.update({
      where: { id_promotion: id },
      data: { supprime: true },
      include: { produit: true, categorie: true }
    });
  }

  async getPromotionsSupprimes(): Promise<Promotion[]> {
    return this.prisma.promotion.findMany({
      where: { supprime: true },
      include: { produit: true, categorie: true }
    });
  }

  async restaurerPromotion(id: string): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id_promotion: id, supprime: true }
    });
    if (!promotion) throw new Error('Promotion supprimée non trouvée');

    return this.prisma.promotion.update({
      where: { id_promotion: id },
      data: { supprime: false },
      include: { produit: true, categorie: true }
    });
  }

  async calculerRemise(data: {
    montant: Decimal;
    type_promo: TypeRemise;
    valeur: Decimal;
  }): Promise<Decimal> {
    if (data.type_promo === 'MONTANT') {
      return data.valeur;
    } else {
      // POURCENTAGE
      return data.montant.mul(data.valeur).div(100);
    }
  }

  async appliquerPromotion(codePromotion: string, montant: Decimal): Promise<{
    promotion: Promotion;
    montantRemise: Decimal;
    montantFinal: Decimal;
  }> {
    const promotion = await this.getPromotionByCode(codePromotion);

    // Vérifier que la promotion est active
    const now = new Date();
    if (now < promotion.date_debut || now > promotion.date_fin) {
      throw new Error('Cette promotion n\'est pas active actuellement');
    }

    const montantRemise = await this.calculerRemise({
      montant,
      type_promo: promotion.type_promo,
      valeur: promotion.valeur
    });

    const montantFinal = montant.sub(montantRemise);

    return {
      promotion,
      montantRemise,
      montantFinal: montantFinal.lessThan(0) ? new Decimal(0) : montantFinal
    };
  }
}