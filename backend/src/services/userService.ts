import { PrismaClient, Role, Statut, Utilisateur } from '@prisma/client';
import bcrypt from 'bcrypt';
import { EmailService } from '../utils/emailService';
import { JWTService } from '../utils/jwtService';
import { generateSecurePassword } from '../utils/passwordGenerator';

export class UtilisateurService {
  private prisma: PrismaClient;
  private emailService: EmailService;

  constructor() {
    this.prisma = new PrismaClient();
    this.emailService = new EmailService();
  }

  async getAllUtilisateurs(): Promise<Omit<Utilisateur, 'mot_de_passe'>[]> { 
    const users = await this.prisma.utilisateur.findMany({
      orderBy: { date_creation: 'desc' }
    });
    
    return users.map(({ mot_de_passe, ...user }) => user);
  }

  async getUtilisateurById(id: string): Promise<Omit<Utilisateur, 'mot_de_passe'>> {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id_utilisateur: id }
    });
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    const { mot_de_passe, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUtilisateursByRole(role: Role): Promise<Omit<Utilisateur, 'mot_de_passe'>[]> {
    const users = await this.prisma.utilisateur.findMany({
      where: { role }
    });
    
    return users.map(({ mot_de_passe, ...user }) => user);
  }

  async createUtilisateur(data: {
    nom_utilisateur: string;
    email: string;
    role?: Role;
  }): Promise<{ user: Omit<Utilisateur, 'mot_de_passe'>; temporaryPassword: string }> {
    // Vérifier unicité email
    const existingUser = await this.prisma.utilisateur.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Générer mot de passe temporaire
    const temporaryPassword = generateSecurePassword(12);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Créer l'utilisateur
    const user = await this.prisma.utilisateur.create({
      data: {
        nom_utilisateur: data.nom_utilisateur,
        email: data.email,
        mot_de_passe: hashedPassword,
        role: data.role || 'CAISSIER',
        statut: 'ACTIF'
      }
    });

    // Envoyer l'email avec le mot de passe temporaire
    try {
      await this.emailService.sendPasswordEmail(
        user.email,
        temporaryPassword,
        user.nom_utilisateur
      );
    } catch (error) {
      // Si l'envoi d'email échoue, supprimer l'utilisateur créé
      await this.prisma.utilisateur.delete({
        where: { id_utilisateur: user.id_utilisateur }
      });
      throw new Error('Impossible d\'envoyer l\'email. Création annulée.');
    }

    const { mot_de_passe, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, temporaryPassword };
  }

  async updateUtilisateur(id: string, data: {
    nom_utilisateur?: string;
    email?: string;
  }): Promise<Omit<Utilisateur, 'mot_de_passe'>> {
    const existingUser = await this.prisma.utilisateur.findUnique({
      where: { id_utilisateur: id }
    });
    
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.prisma.utilisateur.findUnique({
        where: { email: data.email }
      });
      if (emailExists) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }
    }

    const updated = await this.prisma.utilisateur.update({
      where: { id_utilisateur: id },
      data
    });

    const { mot_de_passe, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  async changeStatut(id: string, statut: Statut): Promise<Omit<Utilisateur, 'mot_de_passe'>> {
    const user = await this.prisma.utilisateur.update({
      where: { id_utilisateur: id },
      data: { statut }
    });

    const { mot_de_passe, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changeRole(id: string, role: Role): Promise<Omit<Utilisateur, 'mot_de_passe'>> {
    const user = await this.prisma.utilisateur.update({
      where: { id_utilisateur: id },
      data: { role }
    });

    const { mot_de_passe, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id_utilisateur: id }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.mot_de_passe);
    if (!isValidPassword) {
      throw new Error('Ancien mot de passe incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.utilisateur.update({
      where: { id_utilisateur: id },
      data: { mot_de_passe: hashedPassword }
    });
  }

  async login(email: string, password: string): Promise<{
    user: Omit<Utilisateur, 'mot_de_passe'>;
    token: string;
  }> {
    const user = await this.prisma.utilisateur.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    if (user.statut === 'BLOQUE') {
      throw new Error('Compte bloqué. Contactez l\'administrateur');
    }

    if (user.statut === 'INACTIF') {
      throw new Error('Compte inactif');
    }

    const isValidPassword = await bcrypt.compare(password, user.mot_de_passe);
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    await this.prisma.utilisateur.update({
      where: { id_utilisateur: user.id_utilisateur },
      data: { dernier_login: new Date() }
    });

    const token = JWTService.generateToken({
      id_utilisateur: user.id_utilisateur,
      email: user.email,
      role: user.role,
      nom_utilisateur: user.nom_utilisateur
    });

    const { mot_de_passe, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async logout(id_utilisateur: string): Promise<void> {
    await this.prisma.utilisateur.update({
      where: { id_utilisateur },
      data: { dernier_login: new Date() }
    });
  }

  async deleteUtilisateur(id: string): Promise<Omit<Utilisateur, 'mot_de_passe'>> {
    const user = await this.prisma.utilisateur.update({
      where: { id_utilisateur: id },
      data: { statut: 'INACTIF' }
    });

    const { mot_de_passe, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}