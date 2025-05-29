import express from 'express';
import { checkAuth } from '../middlewares/auth.js';
import { createChallenge, getUserChallenges, getChallengeData } from '../controllers/challengeController.js';

const router = express.Router();

router.post('/create', checkAuth, createChallenge);
router.get('/all', checkAuth, getUserChallenges);
router.get('/getChallengeData', checkAuth, getChallengeData);

export default router;