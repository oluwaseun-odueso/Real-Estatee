import express from 'express';
import { verifyBuyerToken } from '../auth/buyerAuth';
import { getTransaction, initiateTransaction } from '../controllers/transaction';

const router = express.Router();

router.post('/buy_property/:property_id', verifyBuyerToken, initiateTransaction);
router.get('/view_payment/:transaction_id', verifyBuyerToken, getTransaction)

export default router;