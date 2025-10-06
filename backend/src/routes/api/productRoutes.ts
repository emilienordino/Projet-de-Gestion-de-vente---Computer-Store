import { Router } from 'express';
import { ProduitController } from "./../../controllers/productController";

const router = Router();
const controller = new ProduitController();

router.get('/', controller.getAllProduits.bind(controller));
router.get('/code/:code', controller.getProduitByCode.bind(controller));
router.get('/rupture', controller.getProduitsEnRupture.bind(controller));
router.get('/alerte', controller.getProduitsAlerte.bind(controller));
router.get('/categorie/:id', controller.getProduitsByCategorie.bind(controller));
router.get('/search', controller.searchProduits.bind(controller));
router.get('/actifs', controller.getProduitsActifs.bind(controller));
router.get('/supprimes', controller.getProduitsSupprimes.bind(controller));
router.get('/stats-stock', controller.getStatsStock.bind(controller));
router.get('/historique-prix', controller.getHistoriquePrix.bind(controller));
router.get('/:id', controller.getProduitById.bind(controller));
router.post('/', controller.createProduit.bind(controller));
router.put('/:id', controller.updateProduit.bind(controller));
router.patch('/:id/stock', controller.updateStock.bind(controller));
router.delete('/:id', controller.supprimerProduit.bind(controller)); 
router.post('/:id/restaurer', controller.restaurerProduit.bind(controller));

export default router; 