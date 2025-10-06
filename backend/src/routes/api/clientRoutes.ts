import express from 'express';
import { ClientController } from '../../controllers/clientController';
import { authMiddleware } from '../../middleware/auditMiddleware';
import { requireRole } from '../../middleware/roleMiddleware';
import { validate } from '../../middleware/validation';
import { createClientSchema, searchClientSchema, updateClientSchema } from '../../validators/clientValidator';

const router = express.Router();
const controller = new ClientController();

router.use(authMiddleware);

router.get('/', controller.getAll.bind(controller));
router.get('/actifs', controller.getActifs.bind(controller));
router.get('/search', validate(searchClientSchema), controller.search.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.get('/code/:code', controller.getByCode.bind(controller));
router.get('/:id/ventes', controller.getHistoriqueVentes.bind(controller));
router.get('/:id/stats', controller.getStatsClient.bind(controller));

router.post('/', requireRole('ADMIN', 'CAISSIER'), validate(createClientSchema), controller.create.bind(controller));
router.put('/:id', requireRole('ADMIN', 'CAISSIER'), validate(updateClientSchema), controller.update.bind(controller));

router.get('/supprimes', requireRole('ADMIN'), controller.getSupprimes.bind(controller));
router.delete('/:id', requireRole('ADMIN'), controller.supprimer.bind(controller));
router.post('/:id/restaurer', requireRole('ADMIN'), controller.restaurer.bind(controller));

export default router; 