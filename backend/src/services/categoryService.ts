import { CategorieProduit, PrismaClient } from '@prisma/client';

export class CategorieProduitService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllCategories(): Promise<CategorieProduit[]> {
    return this.prisma.categorieProduit.findMany({
      where: { supprime: false }
    });
  }

  async getCategorieById(id: string): Promise<CategorieProduit> {
    const categorie = await this.prisma.categorieProduit.findUnique({
      where: { id_categorie: id }
    });
    if (!categorie) {
      throw new Error('Catégorie non trouvée');
    }
    return categorie;
  }

  async createCategorie(data: { nom: string; description?: string }): Promise<CategorieProduit> {
    const existingCategorie = await this.prisma.categorieProduit.findFirst({
      where: { nom: data.nom, supprime: false }
    });
    
    if (existingCategorie) {
      throw new Error('Une catégorie avec ce nom existe déjà');
    }

    return this.prisma.categorieProduit.create({ data });
  }

  async updateCategorie(id: string, data: { nom?: string; description?: string }): Promise<CategorieProduit> {
    const existingCategorie = await this.prisma.categorieProduit.findUnique({
      where: { id_categorie: id }
    });
    
    if (!existingCategorie) {
      throw new Error('Catégorie non trouvée');
    }

    if (data.nom) {
      const duplicate = await this.prisma.categorieProduit.findFirst({
        where: { nom: data.nom, supprime: false, NOT: { id_categorie: id } }
      });
      if (duplicate) {
        throw new Error('Une catégorie avec ce nom existe déjà');
      }
    }

    return this.prisma.categorieProduit.update({
      where: { id_categorie: id },
      data
    });
  }

  async supprimerCategorie(id: string): Promise<CategorieProduit> {
    return this.prisma.categorieProduit.update({
      where: { id_categorie: id },
      data: { supprime: true }
    });
  }

  async getCategoriesSupprimes(): Promise<CategorieProduit[]> {
    return this.prisma.categorieProduit.findMany({
      where: { supprime: true }
    });
  }

  async restaurerCategorie(id: string): Promise<CategorieProduit> {
    const categorie = await this.prisma.categorieProduit.findUnique({
      where: { id_categorie: id }
    });
    
    if (!categorie || !categorie.supprime) {
      throw new Error('Catégorie supprimée non trouvée');
    }
    
    return this.prisma.categorieProduit.update({
      where: { id_categorie: id },
      data: { supprime: false }
    });
  }
}