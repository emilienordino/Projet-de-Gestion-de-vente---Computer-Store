import { Router } from 'express';
import { UtilisateurController } from '../../controllers/userController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new UtilisateurController();

router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get('/role/:role', controller.getUtilisateursByRole.bind(controller));
router.get('/:id', controller.getUtilisateurById.bind(controller));
router.get('/', controller.getAllUtilisateurs.bind(controller));
router.post('/', controller.createUtilisateur.bind(controller));
router.put('/:id', controller.updateUtilisateur.bind(controller));
router.delete('/:id', controller.deleteUtilisateur.bind(controller));
router.patch('/:id/statut', controller.changeStatut.bind(controller));
router.patch('/:id/role', controller.changeRole.bind(controller));

router.patch('/:id/password', authMiddleware, controller.changePassword.bind(controller));

export default router;