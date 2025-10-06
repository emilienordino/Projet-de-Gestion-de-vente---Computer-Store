import nodemailer from 'nodemailer';
import { emailConfig, frontendUrl } from '../config/email';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendPasswordEmail(email: string, temporaryPassword: string, nom: string): Promise<void> {
    const resetLink = `${frontendUrl}/reset-password?email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: emailConfig.auth.user,
      to: email,
      subject: 'Création de votre compte - Computer Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bienvenue ${nom},</h2>
          <p>Votre compte a été créé avec succès sur Computer Store.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Mot de passe temporaire :</strong></p>
            <p style="font-size: 18px; color: #2563eb; margin: 10px 0;"><code>${temporaryPassword}</code></p>
          </div>
          
          <p style="color: #d97706;"><strong>⚠️ Important :</strong></p>
          <ul style="color: #555;">
            <li>Ce mot de passe est temporaire et doit être changé lors de votre première connexion</li>
            <li>Ne partagez jamais ce mot de passe avec personne</li>
            <li>Le lien de réinitialisation expire dans 24 heures</li>
          </ul>
          
          <a href="${resetLink}" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Changer mon mot de passe
          </a>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Si vous n'avez pas demandé ce compte, veuillez ignorer cet email.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erreur envoi email:', error);
      throw new Error('Impossible d\'envoyer l\'email');
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: emailConfig.auth.user,
      to: email,
      subject: 'Réinitialisation de mot de passe - Computer Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          
          <a href="${resetLink}" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Réinitialiser mon mot de passe
          </a>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}