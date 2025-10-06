import { PrismaClient, Produit } from '@prisma/client';

export class ProduitService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async generateUniqueCode(): Promise<string> {
    let isUnique = false;
    let code = '';
    
    while (!isUnique) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      code = `PROD-${timestamp}${random}`;
      
      const existing = await this.prisma.produit.findUnique({
        where: { code_produit: code }
      });
      
      if (!existing) {
        isUnique = true;
      }
    }
    
    return code;
  }

  async getAllProduits(): Promise<Produit[]> {
    return this.prisma.produit.findMany({
      where: { supprime: false },
      include: { categorie: true }
    });
  }

  async getProduitById(id: string): Promise<Produit> {
    const produit = await this.prisma.produit.findUnique({
      where: { id_produit: id },
      include: { categorie: true }
    });
    if (!produit) {
      throw new Error('Produit non trouvé');
    }
    return produit;
  }

  async getProduitByCode(code: string): Promise<Produit> {
    const produit = await this.prisma.produit.findUnique({
      where: { code_produit: code },
      include: { categorie: true }
    });
    if (!produit) {
      throw new Error('Produit non trouvé');
    }
    return produit;
  }

  async getProduitsByCategorie(id_categorie: string): Promise<Produit[]> {
    return this.prisma.produit.findMany({
      where: { id_categorie, supprime: false },
      include: { categorie: true }
    });
  }

  async getProduitsEnRupture(): Promise<Produit[]> {
    return this.prisma.produit.findMany({
      where: { 
        stock: 0,
        supprime: false 
      },
      include: { categorie: true }
    });
  }

  async getProduitsAlerte(): Promise<Produit[]> {
    return this.prisma.produit.findMany({
      where: { 
        stock: {
          lte: this.prisma.produit.fields.stock_min
        },
        supprime: false 
      },
      include: { categorie: true }
    });
  }

  async searchProduits(params: { 
    query?: string;
    categorieId?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Produit[]> {
    const where: any = { supprime: false };

    if (params.query) {
      where.OR = [
        { nom: { contains: params.query } },
        { description: { contains: params.query } },
        { code_produit: { contains: params.query } }
      ];
    }

    if (params.categorieId) {
      where.id_categorie = params.categorieId;
    }

    if (params.minPrice || params.maxPrice) {
      where.prix_unitaire = {};
      if (params.minPrice) where.prix_unitaire.gte = params.minPrice;
      if (params.maxPrice) where.prix_unitaire.lte = params.maxPrice;
    }

    return this.prisma.produit.findMany({
      where,
      include: { categorie: true }
    });
  }

  async getProduitsActifs(): Promise<Produit[]> {
    return this.prisma.produit.findMany({
      where: { actif: true, supprime: false },
      include: { categorie: true }
    });
  }

  async getProduitsSupprimes(): Promise<Produit[]> {
    return this.prisma.produit.findMany({
      where: { supprime: true },
      include: { categorie: true }
    });
  }

  async createProduit(data: {
    nom: string;
    description?: string;
    prix_unitaire: number;
    photo?: string;
    stock: number;
    stock_min?: number;
    id_categorie: string;
    actif?: boolean;
  }): Promise<Produit> {
    const existingProduit = await this.prisma.produit.findFirst({ 
      where: { nom: data.nom, supprime: false } 
    });
    if (existingProduit) {
      throw new Error('Un produit avec ce nom existe déjà');
    }

    const categorie = await this.prisma.categorieProduit.findUnique({
      where: { id_categorie: data.id_categorie }
    });
    if (!categorie) {
      throw new Error('Catégorie non trouvée');
    }

    const code_produit = await this.generateUniqueCode();

    return this.prisma.produit.create({
      data: { 
        ...data, 
        code_produit,
        stock_min: data.stock_min || 5
      },
      include: { categorie: true }
    });
  }

  async updateProduit(id: string, data: {
    nom?: string;
    description?: string;
    prix_unitaire?: number;
    photo?: string;
    stock?: number;
    stock_min?: number;
    id_categorie?: string;
    actif?: boolean;
  }): Promise<Produit> {
    const existingProduit = await this.prisma.produit.findUnique({
      where: { id_produit: id }
    });
    if (!existingProduit) {
      throw new Error('Produit non trouvé');
    }

    if (data.nom) {
      const duplicate = await this.prisma.produit.findFirst({
        where: { nom: data.nom, supprime: false, NOT: { id_produit: id } }
      });
      if (duplicate) {
        throw new Error('Un produit avec ce nom existe déjà');
      }
    }

    if (data.id_categorie) {
      const categorie = await this.prisma.categorieProduit.findUnique({
        where: { id_categorie: data.id_categorie }
      });
      if (!categorie) {
        throw new Error('Catégorie non trouvée');
      }
    }

    return this.prisma.produit.update({
      where: { id_produit: id },
      data,
      include: { categorie: true }
    });
  }

  async updateStock(id: string, stock: number): Promise<Produit> {
    const produit = await this.prisma.produit.findUnique({
      where: { id_produit: id }
    });
    if (!produit) {
      throw new Error('Produit non trouvé');
    }
    if (stock < 0) {
      throw new Error('Le stock ne peut pas être négatif');
    }

    return this.prisma.produit.update({
      where: { id_produit: id },
      data: { stock },
      include: { categorie: true }
    });
  }

  async supprimerProduit(id: string): Promise<Produit> {
    const produit = await this.prisma.produit.findUnique({
      where: { id_produit: id }
    });
    if (!produit) {
      throw new Error('Produit non trouvé');
    }

    return this.prisma.produit.update({
      where: { id_produit: id },
      data: { supprime: true },
      include: { categorie: true }
    });
  }

  async restaurerProduit(id: string): Promise<Produit> {
    const produit = await this.prisma.produit.findUnique({
      where: { id_produit: id }
    });
    if (!produit || !produit.supprime) {
      throw new Error('Produit supprimé non trouvé');
    }

    return this.prisma.produit.update({
      where: { id_produit: id },
      data: { supprime: false },
      include: { categorie: true }
    });
  }

  async getStatsStock(): Promise<{
    totalProduits: number;
    produitsEnRupture: number;
    produitsAlerte: number;
    stockTotal: number;
  }> {
    const [totalProduits, produitsEnRupture, produitsAlerte, stockAgg] = await Promise.all([
      this.prisma.produit.count({ where: { supprime: false } }),
      this.prisma.produit.count({ where: { stock: 0, supprime: false } }),
      this.prisma.produit.count({ 
        where: { 
          stock: { lte: 5 },
          supprime: false 
        } 
      }),
      this.prisma.produit.aggregate({
        where: { supprime: false },
        _sum: { stock: true }
      })
    ]);

    return {
      totalProduits,
      produitsEnRupture,
      produitsAlerte,
      stockTotal: stockAgg._sum.stock || 0
    };
  }

  async getHistoriquePrix(): Promise<{
    id_produit: string;
    nom: string;
    prix_actuel: number;
    date_modification: Date;
  }[]> {
    const produits = await this.prisma.produit.findMany({
      where: { supprime: false },
      select: {
        id_produit: true,
        nom: true,
        prix_unitaire: true,
        date_creation: true
      },
      orderBy: { date_creation: 'desc' }
    });

    return produits.map(p => ({
      id_produit: p.id_produit,
      nom: p.nom,
      prix_actuel: Number(p.prix_unitaire),
      date_modification: p.date_creation
    }));
  }
}