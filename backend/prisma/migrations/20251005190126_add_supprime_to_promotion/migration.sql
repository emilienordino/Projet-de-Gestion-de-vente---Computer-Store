-- DropIndex
DROP INDEX `audit_id_utilisateur_fkey` ON `audit`;

-- DropIndex
DROP INDEX `lignes_vente_id_produit_fkey` ON `lignes_vente`;

-- DropIndex
DROP INDEX `lignes_vente_id_vente_fkey` ON `lignes_vente`;

-- DropIndex
DROP INDEX `paiements_id_vente_fkey` ON `paiements`;

-- DropIndex
DROP INDEX `produits_id_categorie_fkey` ON `produits`;

-- DropIndex
DROP INDEX `promotions_id_categorie_fkey` ON `promotions`;

-- DropIndex
DROP INDEX `promotions_id_produit_fkey` ON `promotions`;

-- DropIndex
DROP INDEX `ventes_id_caissier_fkey` ON `ventes`;

-- DropIndex
DROP INDEX `ventes_id_client_fkey` ON `ventes`;

-- AlterTable
ALTER TABLE `promotions` ADD COLUMN `supprime` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `produits` ADD CONSTRAINT `produits_id_categorie_fkey` FOREIGN KEY (`id_categorie`) REFERENCES `categories_produits`(`id_categorie`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ventes` ADD CONSTRAINT `ventes_id_caissier_fkey` FOREIGN KEY (`id_caissier`) REFERENCES `utilisateurs`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ventes` ADD CONSTRAINT `ventes_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `clients`(`id_client`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lignes_vente` ADD CONSTRAINT `lignes_vente_id_vente_fkey` FOREIGN KEY (`id_vente`) REFERENCES `ventes`(`id_vente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lignes_vente` ADD CONSTRAINT `lignes_vente_id_produit_fkey` FOREIGN KEY (`id_produit`) REFERENCES `produits`(`id_produit`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paiements` ADD CONSTRAINT `paiements_id_vente_fkey` FOREIGN KEY (`id_vente`) REFERENCES `ventes`(`id_vente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factures` ADD CONSTRAINT `factures_id_vente_fkey` FOREIGN KEY (`id_vente`) REFERENCES `ventes`(`id_vente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotions` ADD CONSTRAINT `promotions_id_produit_fkey` FOREIGN KEY (`id_produit`) REFERENCES `produits`(`id_produit`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotions` ADD CONSTRAINT `promotions_id_categorie_fkey` FOREIGN KEY (`id_categorie`) REFERENCES `categories_produits`(`id_categorie`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit` ADD CONSTRAINT `audit_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs`(`id_utilisateur`) ON DELETE RESTRICT ON UPDATE CASCADE;
