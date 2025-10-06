/*
  Warnings:

  - The primary key for the `audit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `factures` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `lignes_vente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `paiements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `promotions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
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
ALTER TABLE `audit` DROP PRIMARY KEY,
    MODIFY `id_audit` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_audit`);

-- AlterTable
ALTER TABLE `factures` DROP PRIMARY KEY,
    MODIFY `id_facture` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_facture`);

-- AlterTable
ALTER TABLE `lignes_vente` DROP PRIMARY KEY,
    MODIFY `id_ligne` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_ligne`);

-- AlterTable
ALTER TABLE `paiements` DROP PRIMARY KEY,
    MODIFY `id_paiement` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_paiement`);

-- AlterTable
ALTER TABLE `promotions` DROP PRIMARY KEY,
    MODIFY `id_promotion` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_promotion`);

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
