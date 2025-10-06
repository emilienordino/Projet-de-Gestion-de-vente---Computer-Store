import { Router } from 'express';
import { CategorieProduitController } from "./../../controllers/categoryController";

const router = Router();
const controller = new CategorieProduitController();

router.get('/', controller.getAllCategories.bind(controller));
router.get('/supprimes', controller.getCategoriesSupprimes.bind(controller));
router.get('/:id', controller.getCategorieById.bind(controller));
router.post('/', controller.createCategorie.bind(controller));
router.put('/:id', controller.updateCategorie.bind(controller));
router.delete('/:id', controller.supprimerCategorie.bind(controller));
router.post('/:id/restaurer', controller.restaurerCategorie.bind(controller));

export default router;  