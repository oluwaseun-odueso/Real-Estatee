import express from 'express';
import {body} from 'express-validator'
import { verifyBuyerToken } from '../auth/buyerAuth';
import { 
    deleteBuyerAccount,
    getBuyerAccount,
    loginBuyer,
    resetBuyerPassword,
    signUpBuyer, 
    updateBuyerAccount,
    updateBuyerPassword,
    uploadImage
} from '../controllers/buyer';
import { upload } from '../image.config';
const router = express.Router();

router.post(
    '/signup', 
    body('email').isEmail(), 
    body('password')
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/),
    signUpBuyer);
router.post('/login', body('email').isEmail(), loginBuyer);
router.put('/update_account', verifyBuyerToken, updateBuyerAccount);
router.get('/get_account', verifyBuyerToken, getBuyerAccount);
router.delete('/delete_account', verifyBuyerToken, deleteBuyerAccount);
router.put('/update_password', verifyBuyerToken, updateBuyerPassword);
router.post('/upload_image', verifyBuyerToken, upload.single('image'), uploadImage)
router.post('/reset_password', verifyBuyerToken, resetBuyerPassword);

export default router;