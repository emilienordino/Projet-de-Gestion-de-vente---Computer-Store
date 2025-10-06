/*
  Warnings:

  - The primary key for the `categories_produits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `clients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `produits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `utilisateurs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nom` on the `utilisateurs` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `utilisateurs` table. All the data in the column will be lost.
  - The primary key for the `ventes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `nom_utilisateur` to the `utilisateurs` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE `audit` MODIFY `id_utilisateur` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `categories_produits` DROP PRIMARY KEY,
    MODIFY `id_categorie` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_categorie`);

-- AlterTable
ALTER TABLE `clients` DROP PRIMARY KEY,
    MODIFY `id_client` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_client`);

-- AlterTable
ALTER TABLE `factures` MODIFY `id_vente` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `lignes_vente` MODIFY `id_vente` VARCHAR(191) NOT NULL,
    MODIFY `id_produit` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `paiements` MODIFY `id_vente` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `produits` DROP PRIMARY KEY,
    ADD COLUMN `photo` VARCHAR(255) NULL,
    MODIFY `id_produit` VARCHAR(191) NOT NULL,
    MODIFY `id_categorie` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_produit`);

-- AlterTable
ALTER TABLE `promotions` MODIFY `id_produit` VARCHAR(191) NULL,
    MODIFY `id_categorie` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `utilisateurs` DROP PRIMARY KEY,
    DROP COLUMN `nom`,
    DROP COLUMN `prenom`,
    ADD COLUMN `nom_utilisateur` VARCHAR(100) NOT NULL,
    MODIFY `id_utilisateur` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_utilisateur`);

-- AlterTable
ALTER TABLE `ventes` DROP PRIMARY KEY,
    MODIFY `id_vente` VARCHAR(191) NOT NULL,
    MODIFY `id_caissier` VARCHAR(191) NOT NULL,
    MODIFY `id_client` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id_vente`);

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
