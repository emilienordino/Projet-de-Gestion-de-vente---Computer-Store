import { LigneVente, PrismaClient, TypeRemise } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class LigneVenteService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllLignesVente(): Promise<LigneVente[]> {
    return this.prisma.ligneVente.findMany({
      include: {
        produit: true,
        vente: true
      }
    });
  }

  async getLigneById(id: string): Promise<LigneVente> {
    const ligne = await this.prisma.ligneVente.findUnique({
      where: { id_ligne: id },
      include: {
        produit: true,
        vente: true
      }
    });
    if (!ligne) {
      throw new Error('Ligne de vente non trouvée');
    }
    return ligne;
  }

  async getLignesByVente(idVente: string): Promise<LigneVente[]> {
    const vente = await this.prisma.vente.findUnique({
      where: { id_vente: idVente }
    });
    if (!vente) {
      throw new Error('Vente non trouvée');
    }

    return this.prisma.ligneVente.findMany({
      where: { id_vente: idVente },
      include: {
        produit: true
      }
    });
  }

  async createLigne(data: {
    id_vente: string;
    id_produit: string;
    quantite: number;
    prix_unitaire?: Decimal;
    type_remise_ligne?: TypeRemise;
    valeur_remise_ligne?: Decimal;
    sous_total?: Decimal;
  }): Promise<LigneVente> {
    const vente = await this.prisma.vente.findUnique({
      where: { id_vente: data.id_vente }
    });
    if (!vente) {
      throw new Error('Vente non trouvée');
    }

    if (vente.statut_vente === 'PAYEE') {
      throw new Error('Impossible d\'ajouter une ligne à une vente déjà payée');
    }
    if (vente.statut_vente === 'ANNULEE') {
      throw new Error('Impossible d\'ajouter une ligne à une vente annulée');
    }

    const produit = await this.prisma.produit.findUnique({
      where: { id_produit: data.id_produit }
    });
    if (!produit) {
      throw new Error('Produit non trouvé');
    }

    if (!produit.actif) {
      throw new Error('Ce produit est inactif et ne peut pas être vendu');
    }

    if (produit.supprime) {
      throw new Error('Ce produit est supprimé et ne peut pas être vendu');
    }

    if (data.quantite <= 0) {
      throw new Error('La quantité doit être supérieure à zéro');
    }

    if (produit.stock < data.quantite) {
      throw new Error(`Stock insuffisant. Disponible: ${produit.stock}, Demandé: ${data.quantite}`);
    }

    const prix_unitaire = data.prix_unitaire || produit.prix_unitaire;

    if (data.valeur_remise_ligne && data.valeur_remise_ligne.lessThan(0)) {
      throw new Error('La valeur de remise ne peut pas être négative');
    }

    if (data.type_remise_ligne === 'POURCENTAGE' && data.valeur_remise_ligne) {
      if (data.valeur_remise_ligne.greaterThan(100)) {
        throw new Error('Le pourcentage de remise ne peut pas dépasser 100%');
      }
    }

    const montantBrut = prix_unitaire.times(data.quantite);
    let montantRemise = new Decimal(0);

    if (data.type_remise_ligne && data.valeur_remise_ligne) {
      if (data.type_remise_ligne === 'POURCENTAGE') {
        montantRemise = montantBrut.times(data.valeur_remise_ligne).dividedBy(100);
      } else {
        montantRemise = data.valeur_remise_ligne;
      }
    }

    const sous_total = montantBrut.minus(montantRemise);

    if (sous_total.lessThanOrEqualTo(0)) {
      throw new Error('Le sous-total doit être positif après application de la remise');
    }

    const ligne = await this.prisma.ligneVente.create({
      data: {
        id_vente: data.id_vente,
        id_produit: data.id_produit,
        quantite: data.quantite,
        prix_unitaire,
        type_remise_ligne: data.type_remise_ligne,
        valeur_remise_ligne: data.valeur_remise_ligne || new Decimal(0),
        sous_total
      },
      include: {
        produit: true,
        vente: true
      }
    });

    await this.prisma.produit.update({
      where: { id_produit: data.id_produit },
      data: {
        stock: {
          decrement: data.quantite
        }
      }
    });

    return ligne;
  }

  async updateLigne(id: string, data: {
    quantite?: number;
    prix_unitaire?: Decimal;
    type_remise_ligne?: TypeRemise;
    valeur_remise_ligne?: Decimal;
  }): Promise<LigneVente> {
    const ligneExistante = await this.prisma.ligneVente.findUnique({
      where: { id_ligne: id },
      include: {
        vente: true,
        produit: true
      }
    });

    if (!ligneExistante) {
      throw new Error('Ligne de vente non trouvée');
    }

    if (ligneExistante.vente.statut_vente === 'PAYEE') {
      throw new Error('Impossible de modifier une ligne d\'une vente déjà payée');
    }
    if (ligneExistante.vente.statut_vente === 'ANNULEE') {
      throw new Error('Impossible de modifier une ligne d\'une vente annulée');
    }

    if (data.quantite !== undefined) {
      if (data.quantite <= 0) {
        throw new Error('La quantité doit être supérieure à zéro');
      }

      const differenceQuantite = data.quantite - ligneExistante.quantite;

      if (differenceQuantite > 0) {
        const produit = ligneExistante.produit;
        if (produit.stock < differenceQuantite) {
          throw new Error(`Stock insuffisant. Disponible: ${produit.stock}, Supplément nécessaire: ${differenceQuantite}`);
        }

        await this.prisma.produit.update({
          where: { id_produit: ligneExistante.id_produit },
          data: {
            stock: {
              decrement: differenceQuantite
            }
          }
        });
      } else if (differenceQuantite < 0) {
        await this.prisma.produit.update({
          where: { id_produit: ligneExistante.id_produit },
          data: {
            stock: {
              increment: Math.abs(differenceQuantite)
            }
          }
        });
      }
    }

    const updateData: any = {};
    if (data.quantite !== undefined) updateData.quantite = data.quantite;
    if (data.prix_unitaire !== undefined) updateData.prix_unitaire = data.prix_unitaire;
    if (data.type_remise_ligne !== undefined) updateData.type_remise_ligne = data.type_remise_ligne;
    if (data.valeur_remise_ligne !== undefined) updateData.valeur_remise_ligne = data.valeur_remise_ligne;

    const quantite = data.quantite || ligneExistante.quantite;
    const prix_unitaire = data.prix_unitaire || ligneExistante.prix_unitaire;
    const montantBrut = prix_unitaire.times(quantite);
    
    let montantRemise = new Decimal(0);
    const type_remise = data.type_remise_ligne || ligneExistante.type_remise_ligne;
    const valeur_remise = data.valeur_remise_ligne || ligneExistante.valeur_remise_ligne;

    if (type_remise && valeur_remise) {
      if (type_remise === 'POURCENTAGE') {
        if (valeur_remise.greaterThan(100)) {
          throw new Error('Le pourcentage de remise ne peut pas dépasser 100%');
        }
        montantRemise = montantBrut.times(valeur_remise).dividedBy(100);
      } else {
        montantRemise = valeur_remise;
      }
    }

    updateData.sous_total = montantBrut.minus(montantRemise);

    if (updateData.sous_total.lessThanOrEqualTo(0)) {
      throw new Error('Le sous-total doit être positif après application de la remise');
    }

    return this.prisma.ligneVente.update({
      where: { id_ligne: id },
      data: updateData,
      include: {
        produit: true,
        vente: true
      }
    });
  }

  async deleteLigne(id: string): Promise<LigneVente> {
    const ligne = await this.prisma.ligneVente.findUnique({
      where: { id_ligne: id },
      include: {
        vente: true,
        produit: true
      }
    });

    if (!ligne) {
      throw new Error('Ligne de vente non trouvée');
    }

    if (ligne.vente.statut_vente === 'PAYEE') {
      throw new Error('Impossible de supprimer une ligne d\'une vente déjà payée');
    }
    if (ligne.vente.statut_vente === 'ANNULEE') {
      throw new Error('Impossible de supprimer une ligne d\'une vente annulée');
    }

    await this.prisma.produit.update({
      where: { id_produit: ligne.id_produit },
      data: {
        stock: {
          increment: ligne.quantite
        }
      }
    });

    return this.prisma.ligneVente.delete({
      where: { id_ligne: id }
    });
  }

  async calculerSousTotal(id: string): Promise<{ sous_total: Decimal }> {
    const ligne = await this.getLigneById(id);
    return { sous_total: ligne.sous_total };
  }

  async appliquerRemise(id: string, data: {
    type_remise: TypeRemise;
    valeur_remise: Decimal;
  }): Promise<LigneVente> {
    const ligne = await this.prisma.ligneVente.findUnique({
      where: { id_ligne: id },
      include: {
        vente: true,
        produit: true
      }
    });

    if (!ligne) {
      throw new Error('Ligne de vente non trouvée');
    }

    if (ligne.vente.statut_vente === 'PAYEE' || ligne.vente.statut_vente === 'ANNULEE') {
      throw new Error('Impossible de modifier une ligne d\'une vente payée ou annulée');
    }

    if (data.valeur_remise.lessThan(0)) {
      throw new Error('La valeur de remise ne peut pas être négative');
    }

    if (data.type_remise === 'POURCENTAGE' && data.valeur_remise.greaterThan(100)) {
      throw new Error('Le pourcentage de remise ne peut pas dépasser 100%');
    }

    return this.updateLigne(id, {
      type_remise_ligne: data.type_remise,
      valeur_remise_ligne: data.valeur_remise
    });
  }
}