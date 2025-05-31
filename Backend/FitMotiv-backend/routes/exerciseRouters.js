import express from 'express';
import { checkAuth } from '../middlewares/auth.js';
import { getExerciseData } from '../controllers/exerciseController.js';

const router = express.Router();

router.get('/getExerciseData', checkAuth, getExerciseData);


export default router;