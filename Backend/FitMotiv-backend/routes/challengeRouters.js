import express from 'express';
import { checkAuth } from '../middlewares/auth.js';
import { createChallenge, getUserChallenges, getChallengeData, setActiveChallenge } from '../controllers/challengeController.js';

const router = express.Router();

router.post('/create', checkAuth, createChallenge);
router.get('/all', checkAuth, getUserChallenges);
router.get('/getChallengeData', checkAuth, getChallengeData);
router.post('/setActiveChallenge', checkAuth, setActiveChallenge);

export default router;