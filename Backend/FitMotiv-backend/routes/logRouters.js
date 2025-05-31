import express from 'express';
import { checkAuth } from '../middlewares/auth.js';
import { getUserDataChallenges } from '../controllers/logController.js';

const router = express.Router();

router.get('/indexData', checkAuth, getUserDataChallenges);

export default router;