import { Router } from 'express';
import { UtilisateurController } from '../../controllers/userController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();
const controller = new UtilisateurController();

router.post('/login', controller.login.bind(controller));
router.post('/logout', authMiddleware, controller.logout.bind(controller));

export default router;