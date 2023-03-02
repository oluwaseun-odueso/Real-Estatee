import express, { Router, Request, Response } from 'express';
import AWS from '../images2/config';
import {S3_BUCKET_NAME} from '../images2/config'
import { verifySellerToken } from '../auth/jwtAuth';
// import {upload} from '../images2/uploads';

import multer from 'multer';
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
// router.post('/upload', verifySellerToken, upload.single("image"), (req: Request, res: Response) => {
//     if (!req.file) {
//         res.status(400).send({message: "Please select an image"});
//         // throw new Error ("Please select an image");
//         return;
//     };

//     const file: any = req.file

//     res.send(file.location)
// })

router.post('/upload_image', verifySellerToken,  upload.single('image'), uploadSellerImage);

export default router;