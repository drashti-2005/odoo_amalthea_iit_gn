import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';

const router = Router();
const healthController = new HealthController();

// GET /api/health
router.get('/', healthController.getHealth);

export default router;