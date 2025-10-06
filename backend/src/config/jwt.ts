export const jwtConfig = {
  secret: process.env.JWT_SECRET || '93LfCIU6ObUM9z94L+VJnWyEm6y4u/BzD/k1EcfxUTs=',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshExpiresIn: '7d'
};