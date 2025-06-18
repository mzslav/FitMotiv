import express from 'express';
import { checkAuth } from '../middlewares/auth.js';
import { auth,createWallet, sendWalletData } from '../controllers/userController.js';


const router = express.Router();

router.post('/login', checkAuth, auth);

router.post('/createWallet', checkAuth, createWallet);

router.get('/getAddress', checkAuth, sendWalletData )



export default router;