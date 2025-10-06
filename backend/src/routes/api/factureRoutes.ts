import { Router } from 'express';
import { FactureController } from '../../controllers/factureController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new FactureController();

router.use(authMiddleware);

router.get('/stats', controller.getStatsFactures.bind(controller));
router.get('/periode', controller.getFacturesPeriode.bind(controller));
router.get('/:id', controller.getFactureById.bind(controller));
router.get('/numero/:numero', controller.getFactureByNumero.bind(controller));
router.get('/vente/:idVente', controller.getFactureByVente.bind(controller));
router.get('/', controller.getAllFactures.bind(controller));

router.post('/', requireRole('ADMIN', 'CAISSIER'), controller.createFacture.bind(controller));
router.put('/:id', requireRole('ADMIN', 'CAISSIER'), controller.updateFacture.bind(controller));
router.post('/:id/regenerer-pdf', requireRole('ADMIN', 'CAISSIER'), controller.regenererPDF.bind(controller));

router.post('/:id/annuler', requireRole('ADMIN'), controller.annulerFacture.bind(controller));
router.delete('/:id', requireRole('ADMIN'), controller.deleteFacture.bind(controller));

export default router;