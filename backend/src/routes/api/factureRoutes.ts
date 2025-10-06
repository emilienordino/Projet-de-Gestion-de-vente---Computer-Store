import { Router } from 'express';
import { FactureController } from '../../controllers/factureController';

const router = Router();
const controller = new FactureController();

router.get('/', controller.getAllFactures.bind(controller));
router.get('/stats', controller.getStatsFactures.bind(controller));
router.get('/periode', controller.getFacturesPeriode.bind(controller));
router.get('/:id', controller.getFactureById.bind(controller));
router.get('/numero/:numero', controller.getFactureByNumero.bind(controller));
router.get('/vente/:idVente', controller.getFactureByVente.bind(controller));
router.post('/', controller.createFacture.bind(controller));
router.put('/:id', controller.updateFacture.bind(controller));
router.post('/:id/annuler', controller.annulerFacture.bind(controller));
router.post('/:id/regenerer-pdf', controller.regenererPDF.bind(controller));
router.delete('/:id', controller.deleteFacture.bind(controller));

export default router; 