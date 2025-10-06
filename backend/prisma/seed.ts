import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Exemple : Seed un admin (mais hash le mot de passe manuellement pour l'instant)
  await prisma.utilisateur.create({
    data: {
      nom: 'Admin',
      prenom: 'Principal',
      email: 'admin@salesapp.com',
      mot_de_passe: 'hashed_password_here',  // Hash avec bcrypt plus tard
      role: 'ADMIN',
    },
  });
  console.log('Seeding completed');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());