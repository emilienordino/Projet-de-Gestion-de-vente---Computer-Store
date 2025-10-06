import { Router } from 'express';
import { PaiementController } from '../../controllers/paiementController';

const router = Router();
const controller = new PaiementController();

router.get('/', controller.getAllPaiements.bind(controller));
router.get('/stats', controller.getStatsPaiements.bind(controller));
router.get('/periode', controller.getPaiementsPeriode.bind(controller));
router.get('/:id', controller.getPaiementById.bind(controller));
router.get('/vente/:idVente', controller.getPaiementsByVente.bind(controller));
router.get('/mode/:mode', controller.getPaiementsByMode.bind(controller));
router.post('/', controller.createPaiement.bind(controller));
router.put('/:id', controller.updatePaiement.bind(controller));
router.patch('/:id/statut', controller.changerStatutPaiement.bind(controller));
router.post('/:id/valider', controller.validerPaiement.bind(controller));
router.post('/:id/refuser', controller.refuserPaiement.bind(controller));
router.delete('/:id', controller.deletePaiement.bind(controller));

export default router; 