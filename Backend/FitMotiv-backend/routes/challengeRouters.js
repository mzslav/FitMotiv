import express from 'express';
import { checkAuth } from '../middlewares/auth.js';
import { createChallenge, getUserChallenges, getChallengeData, setActiveChallenge, getExpectedAmount, sendUserTransactions } from '../controllers/challengeController.js';

const router = express.Router();

router.post('/create', checkAuth, createChallenge);
router.get('/all', checkAuth, getUserChallenges);
router.get('/getChallengeData', checkAuth, getChallengeData);
router.post('/setActiveChallenge', checkAuth, setActiveChallenge);
router.get('/getExpectedAmount', checkAuth, getExpectedAmount);
router.get('/getTransactions', checkAuth, sendUserTransactions);

export default router;