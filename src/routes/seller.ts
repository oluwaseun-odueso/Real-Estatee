import express, { Router } from 'express';
import {body} from 'express-validator'
import { verifySellerToken } from '../auth/sellerAuth';

import { 
    deleteAccount,
    deleteImage,
    forgotSellerPassword,
    getImage,
    getSellerAccount,
    loginSeller, 
    signUpSeller, 
    updateSellerAccount,
    updateSellerPassword,
    uploadImage,
} from '../controllers/seller';
import { upload } from '../util/image.config';

const router: Router = express.Router();

router.post(
    '/signup', 
    body('email').isEmail(), 
    body('password')
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/), 
    signUpSeller);
router.post('/login', body('email').isEmail(), loginSeller);
router.put('/update_account', verifySellerToken, updateSellerAccount);
router.get('/get_account', verifySellerToken, getSellerAccount);
router.delete('/delete_account', verifySellerToken, deleteAccount);
router.post('/upload_image', verifySellerToken, upload.single('image'), uploadImage)
router.get('/get_image/:filename', getImage)
router.delete('/delete_image', verifySellerToken, deleteImage)
router.put('/update_password', verifySellerToken, updateSellerPassword);
router.post('/reset_password', forgotSellerPassword)

export default router;