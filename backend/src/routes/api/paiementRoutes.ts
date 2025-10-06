import { Router } from 'express';
import { PaiementController } from '../../controllers/paiementController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new PaiementController();

router.use(authMiddleware);

router.get('/stats', controller.getStatsPaiements.bind(controller));
router.get('/periode', controller.getPaiementsPeriode.bind(controller));
router.get('/:id', controller.getPaiementById.bind(controller));
router.get('/vente/:idVente', controller.getPaiementsByVente.bind(controller));
router.get('/mode/:mode', controller.getPaiementsByMode.bind(controller));
router.get('/', controller.getAllPaiements.bind(controller));

router.post('/', requireRole('ADMIN', 'CAISSIER'), controller.createPaiement.bind(controller));
router.put('/:id', requireRole('ADMIN', 'CAISSIER'), controller.updatePaiement.bind(controller));
router.patch('/:id/statut', requireRole('ADMIN', 'CAISSIER'), controller.changerStatutPaiement.bind(controller));
router.post('/:id/valider', requireRole('ADMIN', 'CAISSIER'), controller.validerPaiement.bind(controller));

router.post('/:id/refuser', requireRole('ADMIN'), controller.refuserPaiement.bind(controller));
router.delete('/:id', requireRole('ADMIN'), controller.deletePaiement.bind(controller));

export default router;