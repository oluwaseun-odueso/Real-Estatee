import express, { Router } from 'express';
import { verifyBuyerToken } from '../auth/buyerAuth';
import { 
    loginBuyer,
    signUpBuyer, 
} from '../controllers/buyer';
const router = express.Router();

router.post('/signup', signUpBuyer);
router.post('/login', loginBuyer)

export default router;