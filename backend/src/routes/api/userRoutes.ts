import { Router } from 'express';
import { UtilisateurController } from '../../controllers/userController';

const router = Router();
const controller = new UtilisateurController();

// Routes spécifiques en premier
router.get('/role/:role', controller.getUtilisateursByRole.bind(controller));
router.get('/:id', controller.getUtilisateurById.bind(controller));
router.get('/', controller.getAllUtilisateurs.bind(controller));

// CRUD
router.post('/', controller.createUtilisateur.bind(controller));
router.put('/:id', controller.updateUtilisateur.bind(controller));
router.delete('/:id', controller.deleteUtilisateur.bind(controller));

// Gestion
router.patch('/:id/statut', controller.changeStatut.bind(controller));
router.patch('/:id/role', controller.changeRole.bind(controller));
router.patch('/:id/password', controller.changePassword.bind(controller));

export default router; 