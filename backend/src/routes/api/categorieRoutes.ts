import { Router } from 'express';
import { CategorieProduitController } from '../../controllers/categoryController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new CategorieProduitController();

router.use(authMiddleware);

router.get('/', controller.getAllCategories.bind(controller));
router.get('/:id', controller.getCategorieById.bind(controller));

router.post('/', requireRole('ADMIN', 'RESP_STOCK'), controller.createCategorie.bind(controller));
router.put('/:id', requireRole('ADMIN', 'RESP_STOCK'), controller.updateCategorie.bind(controller));
router.delete('/:id', requireRole('ADMIN', 'RESP_STOCK'), controller.supprimerCategorie.bind(controller));

router.get('/supprimes', requireRole('ADMIN'), controller.getCategoriesSupprimes.bind(controller));
router.post('/:id/restaurer', requireRole('ADMIN'), controller.restaurerCategorie.bind(controller));

export default router;