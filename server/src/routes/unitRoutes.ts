import { Router } from 'express';
import * as unitController from '../controllers/unitController';

const router = Router();

router.post('/bulk', unitController.createBulk);
router.get('/building/:buildingId', unitController.getByBuildingId);
router.get('/:id', unitController.getById);

export default router;

