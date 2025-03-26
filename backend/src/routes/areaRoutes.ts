// /backend/src/routes/areaRoutes.ts
import express from 'express';
import * as areaController from '../controllers/areaController'

const router = express.Router();

router.get('/', areaController.getAllAreas);
router.get('/:id', areaController.getAreaById);
router.post('/', areaController.createArea);
router.put('/:id', areaController.updateArea);
router.delete('/:id', areaController.deleteArea);

export default router;
