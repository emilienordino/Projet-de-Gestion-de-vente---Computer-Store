import { Router } from 'express';
import { LigneVenteController } from '../../controllers/saleLineController';

const router = Router();
const controller = new LigneVenteController();

router.get('/', controller.getAllLignesVente.bind(controller));
router.get('/:id', controller.getLigneById.bind(controller));
router.get('/vente/:idVente', controller.getLignesByVente.bind(controller));
router.post('/', controller.createLigne.bind(controller));
router.put('/:id', controller.updateLigne.bind(controller));
router.delete('/:id', controller.deleteLigne.bind(controller));
router.get('/:id/sous-total', controller.calculerSousTotal.bind(controller));
router.post('/:id/remise', controller.appliquerRemise.bind(controller));

export default router; 