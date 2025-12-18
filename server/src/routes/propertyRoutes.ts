import { Router } from 'express';
import * as propertyController from '../controllers/propertyController';

const router = Router();

router.get('/', propertyController.getAll);
router.get('/:id', propertyController.getById);
router.post('/', propertyController.create);

export default router;

