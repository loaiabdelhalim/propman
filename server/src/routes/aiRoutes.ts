import { Router } from 'express';
import multer from 'multer';
import * as aiController from '../controllers/aiController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/ai/parse-file
router.post('/parse-file', upload.single('file'), aiController.parseFile);

export default router;
