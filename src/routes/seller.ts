import express, { Router } from 'express';
import multer from 'multer';
import { verifySellerToken } from '../auth/jwtAuth';
const upload = multer({ dest: 'uploads/ '})
import { 
    deleteAccount,
    getSellerAccount,
    loginSeller, 
    signUpSeller, 
    updateSellerAccount,
    uploadSellerImage
} from '../controllers/seller';

const router: Router = express.Router();

router.post('/signup', signUpSeller);
router.post('/login', loginSeller);
router.put('/update_account', verifySellerToken, updateSellerAccount);
router.get('/get_account', verifySellerToken, getSellerAccount);
router.delete('/delete_account', verifySellerToken, deleteAccount);
router.post('/upload_image', verifySellerToken,  upload.single('image'), uploadSellerImage);

export default router;