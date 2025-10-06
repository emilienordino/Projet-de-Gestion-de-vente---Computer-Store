import express from 'express';
import authRoutes from './authRoutes';
import categorieRoutes from './categorieRoutes';
import clientRoutes from './clientRoutes';
import productRoutes from './productRoutes';
import promotionRoutes from './promotionRoutes';
import saleLineRoutes from './saleLineRoutes';
import saleRoutes from './saleRoutes';
import userRoutes from './userRoutes';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/products', productRoutes);
router.use('/categories', categorieRoutes);
router.use('/sales', saleRoutes);
router.use('/sale-line', saleLineRoutes); 
router.use('/promotions', promotionRoutes);

export default router;