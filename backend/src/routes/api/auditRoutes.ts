import { Router } from 'express';
import { AuditController } from '../../controllers/auditController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new AuditController();

router.use(authMiddleware);

// ADMIN : accès complet
router.get('/stats', requireRole('ADMIN'), controller.getStatsAudits.bind(controller));
router.get('/periode', requireRole('ADMIN'), controller.getAuditsPeriode.bind(controller));
router.get('/table/:table', requireRole('ADMIN'), controller.getAuditsByTable.bind(controller));
router.get('/action/:action', requireRole('ADMIN'), controller.getAuditsByAction.bind(controller));
router.get('/:id', requireRole('ADMIN'), controller.getAuditById.bind(controller));
router.get('/', requireRole('ADMIN'), controller.getAllAudits.bind(controller));
router.delete('/old', requireRole('ADMIN'), controller.deleteOldAudits.bind(controller));

router.get('/user/:idUtilisateur', controller.getAuditsByUser.bind(controller));

export default router;