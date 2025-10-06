import { Router } from 'express';
import { PromotionController } from '../../controllers/promotionController';

const router = Router();
const controller = new PromotionController();

// CRUD basique
router.get('/', controller.getAllPromotions.bind(controller));
router.get('/:id', controller.getPromotionById.bind(controller));
router.get('/code/:code', controller.getPromotionByCode.bind(controller));
router.post('/', controller.createPromotion.bind(controller));
router.put('/:id', controller.updatePromotion.bind(controller));

// Suppression logique
router.delete('/:id', controller.supprimerPromotion.bind(controller));
router.get('/supprimes/liste', controller.getPromotionsSupprimes.bind(controller));
router.patch('/:id/restaurer', controller.restaurerPromotion.bind(controller));

// Recherches spécifiques
router.get('/actives/liste', controller.getPromotionsActives.bind(controller));
router.get('/produit/:idProduit', controller.getPromotionsByProduit.bind(controller));
router.get('/categorie/:idCategorie', controller.getPromotionsByCategorie.bind(controller));

// Application de promotion
router.post('/appliquer', controller.appliquerPromotion.bind(controller));

export default router; 