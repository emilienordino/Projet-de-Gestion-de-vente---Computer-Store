import { Router } from 'express';
import { LigneVenteController } from '../../controllers/saleLineController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new LigneVenteController();

router.use(authMiddleware);

router.get('/', controller.getAllLignesVente.bind(controller));
router.get('/:id', controller.getLigneById.bind(controller));
router.get('/vente/:idVente', controller.getLignesByVente.bind(controller));
router.get('/:id/sous-total', controller.calculerSousTotal.bind(controller));

router.post('/', requireRole('ADMIN', 'CAISSIER'), controller.createLigne.bind(controller));
router.put('/:id', requireRole('ADMIN', 'CAISSIER'), controller.updateLigne.bind(controller));
router.delete('/:id', requireRole('ADMIN', 'CAISSIER'), controller.deleteLigne.bind(controller));
router.post('/:id/remise', requireRole('ADMIN', 'CAISSIER'), controller.appliquerRemise.bind(controller));

export default router;