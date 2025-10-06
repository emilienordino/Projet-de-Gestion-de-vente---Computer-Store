-- CreateTable
CREATE TABLE `utilisateurs` (
    `id_utilisateur` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NULL,
    `email` VARCHAR(150) NOT NULL,
    `mot_de_passe` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'RESP_STOCK', 'CAISSIER') NOT NULL DEFAULT 'CAISSIER',
    `statut` ENUM('ACTIF', 'INACTIF') NOT NULL DEFAULT 'ACTIF',
    `dernier_login` DATETIME(3) NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `utilisateurs_email_key`(`email`),
    PRIMARY KEY (`id_utilisateur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id_client` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NULL,
    `telephone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(150) NULL,
    `adresse` VARCHAR(255) NULL,
    `code_client` VARCHAR(20) NOT NULL,
    `supprime` BOOLEAN NOT NULL DEFAULT false,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `clients_code_client_key`(`code_client`),
    PRIMARY KEY (`id_client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories_produits` (
    `id_categorie` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `supprime` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id_categorie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produits` (
    `id_produit` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `prix_unitaire` DECIMAL(10, 2) NOT NULL,
    `stock` INTEGER NOT NULL,
    `stock_min` INTEGER NOT NULL DEFAULT 5,
    `code_produit` VARCHAR(50) NOT NULL,
    `id_categorie` INTEGER NOT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `supprime` BOOLEAN NOT NULL DEFAULT false,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `produits_code_produit_key`(`code_produit`),
    PRIMARY KEY (`id_produit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ventes` (
    `id_vente` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_vente` VARCHAR(50) NOT NULL,
    `date_vente` DATETIME(3) NOT NULL,
    `id_caissier` INTEGER NOT NULL,
    `id_client` INTEGER NULL,
    `total_brut` DECIMAL(10, 2) NOT NULL,
    `remise_total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total_net` DECIMAL(10, 2) NOT NULL,
    `statut_vente` ENUM('COMMANDE', 'EN_COURS', 'PAYEE', 'REMBOURSEE', 'ANNULEE') NOT NULL DEFAULT 'COMMANDE',
    `commentaire` TEXT NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_modification` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ventes_numero_vente_key`(`numero_vente`),
    PRIMARY KEY (`id_vente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lignes_vente` (
    `id_ligne` INTEGER NOT NULL AUTO_INCREMENT,
    `id_vente` INTEGER NOT NULL,
    `id_produit` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `prix_unitaire` DECIMAL(10, 2) NOT NULL,
    `type_remise_ligne` ENUM('MONTANT', 'POURCENTAGE') NULL,
    `valeur_remise_ligne` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `sous_total` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id_ligne`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paiements` (
    `id_paiement` INTEGER NOT NULL AUTO_INCREMENT,
    `id_vente` INTEGER NOT NULL,
    `date_paiement` DATETIME(3) NOT NULL,
    `montant` DECIMAL(10, 2) NOT NULL,
    `mode_paiement` ENUM('CASH', 'CARTE', 'MOBILE_MONEY', 'CHEQUE', 'AUTRE') NOT NULL,
    `statut_paiement` ENUM('EN_ATTENTE', 'VALIDE', 'REFUSE') NOT NULL DEFAULT 'VALIDE',
    `numero_paiement` VARCHAR(30) NOT NULL,
    `reference` VARCHAR(150) NULL,
    `commentaire` TEXT NULL,

    UNIQUE INDEX `paiements_numero_paiement_key`(`numero_paiement`),
    PRIMARY KEY (`id_paiement`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `factures` (
    `id_facture` INTEGER NOT NULL AUTO_INCREMENT,
    `id_vente` INTEGER NOT NULL,
    `numero_facture` VARCHAR(50) NOT NULL,
    `date_emission` DATETIME(3) NOT NULL,
    `montant_total` DECIMAL(10, 2) NOT NULL,
    `statut_facture` ENUM('GENEREE', 'ANNULEE') NOT NULL DEFAULT 'GENEREE',
    `pdf_url` VARCHAR(255) NULL,

    UNIQUE INDEX `factures_id_vente_key`(`id_vente`),
    UNIQUE INDEX `factures_numero_facture_key`(`numero_facture`),
    PRIMARY KEY (`id_facture`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotions` (
    `id_promotion` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(150) NOT NULL,
    `code_promotion` VARCHAR(20) NOT NULL,
    `description` TEXT NULL,
    `type_promo` ENUM('MONTANT', 'POURCENTAGE') NOT NULL,
    `valeur` DECIMAL(10, 2) NOT NULL,
    `date_debut` DATETIME(3) NOT NULL,
    `date_fin` DATETIME(3) NOT NULL,
    `id_produit` INTEGER NULL,
    `id_categorie` INTEGER NULL,

    UNIQUE INDEX `promotions_code_promotion_key`(`code_promotion`),
    PRIMARY KEY (`id_promotion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit` (
    `id_audit` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilisateur` INTEGER NOT NULL,
    `table_affectee` VARCHAR(100) NOT NULL,
    `action` ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT') NOT NULL,
    `details` JSON NULL,
    `ip_adresse` VARCHAR(45) NOT NULL,
    `device_info` VARCHAR(255) NULL,
    `date_action` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_audit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
