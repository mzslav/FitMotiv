import express from 'express';
import { checkAuth } from '../middlewares/auth.js';
import { getExerciseData, saveExerciseProgress } from '../controllers/exerciseController.js';

const router = express.Router();

router.get('/getExerciseData', checkAuth, getExerciseData);
router.post('/saveExerciseProgress', checkAuth, saveExerciseProgress);


export default router;