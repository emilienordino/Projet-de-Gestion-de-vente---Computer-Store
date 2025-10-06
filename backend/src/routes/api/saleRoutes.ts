// ✅ CORRECT - Préserve le contexte this
import { Router } from 'express';
import { VenteController } from '../../controllers/saleController';

const router = Router();
const controller = new VenteController();

/*router.get('/', controller.getAllVentes.bind(controller));
router.get('/:id', controller.getVenteById.bind(controller));
router.get('/numero/:numero', controller.getVenteByNumero.bind(controller));
router.get('/statut/:statut', controller.getVentesByStatut.bind(controller));
router.post('/', controller.createVente.bind(controller));
router.put('/:id', controller.updateVente.bind(controller));
router.patch('/:id/statut', controller.changerStatutVente.bind(controller));
router.post('/:id/paiement', controller.ajouterPaiement.bind(controller));
router.post('/:id/rembourser', controller.rembourserVente.bind(controller));
router.post('/:id/annuler', controller.annulerVente.bind(controller));
router.get('/:id/lignes', controller.getLignesVente.bind(controller));
router.post('/:id/lignes', controller.ajouterLigne.bind(controller));
router.put('/:id/lignes/:idLigne', controller.updateLigne.bind(controller));
router.delete('/:id/lignes/:idLigne', controller.supprimerLigne.bind(controller));
router.get('/periode', controller.getVentesPeriode.bind(controller));
router.get('/stats', controller.getStatsVentes.bind(controller));
router.get('/caissier/:id', controller.getVentesByCaissier.bind(controller));
router.get('/client/:id', controller.getVentesByClient.bind(controller));
router.post('/:id/facture', controller.genererFacture.bind(controller));
router.get('/export', controller.exportVentes.bind(controller));*/

// ✅ Routes spécifiques EN PREMIER
router.get('/stats', controller.getStatsVentes.bind(controller));
router.get('/export', controller.exportVentes.bind(controller));
router.get('/periode', controller.getVentesPeriode.bind(controller));

// Routes avec paramètres statiques
router.get('/statut/:statut', controller.getVentesByStatut.bind(controller));
router.get('/caissier/:id', controller.getVentesByCaissier.bind(controller));
router.get('/client/:id', controller.getVentesByClient.bind(controller));
router.get('/numero/:numero', controller.getVenteByNumero.bind(controller));

// ✅ Routes paramétrées dynamiques EN DERNIER
router.get('/:id', controller.getVenteById.bind(controller));
router.get('/:id/lignes', controller.getLignesVente.bind(controller));

// Routes POST/PUT/PATCH/DELETE
router.get('/', controller.getAllVentes.bind(controller));
router.post('/', controller.createVente.bind(controller));
router.put('/:id', controller.updateVente.bind(controller));
router.patch('/:id/statut', controller.changerStatutVente.bind(controller));
router.post('/:id/paiement', controller.ajouterPaiement.bind(controller));
router.post('/:id/rembourser', controller.rembourserVente.bind(controller));
router.post('/:id/annuler', controller.annulerVente.bind(controller));
router.post('/:id/lignes', controller.ajouterLigne.bind(controller));
router.put('/:id/lignes/:idLigne', controller.updateLigne.bind(controller));
router.delete('/:id/lignes/:idLigne', controller.supprimerLigne.bind(controller));
router.post('/:id/facture', controller.genererFacture.bind(controller));

export default router; 