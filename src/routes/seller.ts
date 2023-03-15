import express, { Router } from 'express';
import {body} from 'express-validator'
import { verifySellerToken } from '../auth/sellerAuth';
// import {upload} from '../images2/uploads';

import multer from 'multer';
const upload = multer({ dest: 'uploads/ '})
import { 
    deleteAccount,
    getSellerAccount,
    loginSeller, 
    signUpSeller, 
    updateSellerAccount,
    updateSellerPassword,
    uploadSellerImage
} from '../controllers/seller';

const router: Router = express.Router();

router.post(
    '/signup', 
    body('email').isEmail(), 
    body('password')
    .isLength({min: 8})
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/), 
    signUpSeller);
router.post('/login', loginSeller);
router.put('/update_account', verifySellerToken, updateSellerAccount);
router.get('/get_account', verifySellerToken, getSellerAccount);
router.delete('/delete_account', verifySellerToken, deleteAccount);
router.post('/upload-image', verifySellerToken,  upload.single('image'), uploadSellerImage);
router.put('/update_password', verifySellerToken, updateSellerPassword)

export default router;