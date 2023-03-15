import express from 'express';
import {body} from 'express-validator'
import { verifyBuyerToken } from '../auth/buyerAuth';
import { 
    deleteBuyerAccount,
    getBuyerAccount,
    loginBuyer,
    signUpBuyer, 
    updateBuyerAccount,
    updateBuyerPassword
} from '../controllers/buyer';
const router = express.Router();

router.post(
    '/signup', 
    body('email').isEmail(), 
    body('password').isLength({min: 8}), 
    signUpBuyer);
router.post('/login', loginBuyer)
router.put('/update_account', verifyBuyerToken, updateBuyerAccount)
router.get('/get_account', verifyBuyerToken, getBuyerAccount)
router.delete('/delete_account', verifyBuyerToken, deleteBuyerAccount)
router.put('/update_password', verifyBuyerToken, updateBuyerPassword)

export default router;