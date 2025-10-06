import { Router } from 'express';
import { ProduitController } from '../../controllers/productController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new ProduitController();

router.use(authMiddleware);

router.get('/', controller.getAllProduits.bind(controller));
router.get('/actifs', controller.getProduitsActifs.bind(controller));
router.get('/rupture', controller.getProduitsEnRupture.bind(controller));
router.get('/alerte', controller.getProduitsAlerte.bind(controller));
router.get('/search', controller.searchProduits.bind(controller));
router.get('/stats-stock', controller.getStatsStock.bind(controller));
router.get('/categorie/:id', controller.getProduitsByCategorie.bind(controller));
router.get('/:id', controller.getProduitById.bind(controller));
router.get('/code/:code', controller.getProduitByCode.bind(controller));

router.post('/', requireRole('ADMIN', 'RESP_STOCK'), controller.createProduit.bind(controller));
router.put('/:id', requireRole('ADMIN', 'RESP_STOCK'), controller.updateProduit.bind(controller));
router.patch('/:id/stock', requireRole('ADMIN', 'RESP_STOCK'), controller.updateStock.bind(controller));
router.delete('/:id', requireRole('ADMIN', 'RESP_STOCK'), controller.supprimerProduit.bind(controller));

router.get('/supprimes', requireRole('ADMIN'), controller.getProduitsSupprimes.bind(controller));
router.get('/historique-prix', requireRole('ADMIN'), controller.getHistoriquePrix.bind(controller));
router.post('/:id/restaurer', requireRole('ADMIN'), controller.restaurerProduit.bind(controller));

export default router;