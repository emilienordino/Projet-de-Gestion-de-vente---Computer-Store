import { Router } from 'express';
import { AuditController } from '../../controllers/auditController';

const router = Router();
const controller = new AuditController();

router.get('/stats', controller.getStatsAudits.bind(controller));
router.get('/periode', controller.getAuditsPeriode.bind(controller));
router.get('/user/:idUtilisateur', controller.getAuditsByUser.bind(controller));
router.get('/table/:table', controller.getAuditsByTable.bind(controller));
router.get('/action/:action', controller.getAuditsByAction.bind(controller));
router.get('/:id', controller.getAuditById.bind(controller));
router.get('/', controller.getAllAudits.bind(controller));
router.delete('/old', controller.deleteOldAudits.bind(controller));

export default router; 