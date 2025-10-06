import { Router } from 'express';
import { VenteController } from '../../controllers/saleController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new VenteController();

router.use(authMiddleware);

router.get('/stats', controller.getStatsVentes.bind(controller));
router.get('/export', requireRole('ADMIN'), controller.exportVentes.bind(controller));
router.get('/periode', controller.getVentesPeriode.bind(controller));
router.get('/statut/:statut', controller.getVentesByStatut.bind(controller));
router.get('/caissier/:id', controller.getVentesByCaissier.bind(controller));
router.get('/client/:id', controller.getVentesByClient.bind(controller));
router.get('/numero/:numero', controller.getVenteByNumero.bind(controller));

router.get('/:id', controller.getVenteById.bind(controller));
router.get('/:id/lignes', controller.getLignesVente.bind(controller));
router.get('/', controller.getAllVentes.bind(controller));

router.post('/', requireRole('ADMIN', 'CAISSIER'), controller.createVente.bind(controller));
router.put('/:id', requireRole('ADMIN', 'CAISSIER'), controller.updateVente.bind(controller));
router.patch('/:id/statut', requireRole('ADMIN', 'CAISSIER'), controller.changerStatutVente.bind(controller));
router.post('/:id/paiement', requireRole('ADMIN', 'CAISSIER'), controller.ajouterPaiement.bind(controller));
router.post('/:id/lignes', requireRole('ADMIN', 'CAISSIER'), controller.ajouterLigne.bind(controller));
router.put('/:id/lignes/:idLigne', requireRole('ADMIN', 'CAISSIER'), controller.updateLigne.bind(controller));
router.delete('/:id/lignes/:idLigne', requireRole('ADMIN', 'CAISSIER'), controller.supprimerLigne.bind(controller));
router.post('/:id/facture', requireRole('ADMIN', 'CAISSIER'), controller.genererFacture.bind(controller));

router.post('/:id/rembourser', requireRole('ADMIN'), controller.rembourserVente.bind(controller));
router.post('/:id/annuler', requireRole('ADMIN'), controller.annulerVente.bind(controller));

export default router;