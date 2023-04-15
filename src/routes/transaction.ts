import express from 'express';
import { verifyBuyerToken } from '../auth/buyerAuth';
import { initiateTransaction } from '../controllers/transaction';

const router = express.Router();

router.post('/buy_property/:property_id', verifyBuyerToken, initiateTransaction);

export default router;