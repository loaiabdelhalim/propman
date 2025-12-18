import { Router } from 'express';
import * as buildingController from '../controllers/buildingController';

const router = Router();

router.post('/', buildingController.create);
router.get('/:id', buildingController.getById);
router.get('/property/:propertyId', buildingController.getByPropertyId);

export default router;

