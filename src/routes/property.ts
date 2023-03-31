import express, {Request, Response} from 'express';
import { verifySellerToken } from '../auth/sellerAuth'

import { 
    addProperty, 
    deleteImages, 
    deleteProperty, 
    getProperties, 
    getProperty, 
    updateProperty, 
    uploadImages
} from '../controllers/property';

import { 
    addPropertyFeature, 
    getPropertyFeatures, 
    updatePropertyFeatures 
} from '../controllers/propertyFeature';
import { getImage } from '../controllers/seller';
import { upload } from '../image.config';

const router = express.Router()

router.post('/put_property_for_sale', verifySellerToken, addProperty);
router.post('/add_property_features/:id', verifySellerToken, addPropertyFeature)
router.get('/get_property/:id', getProperty)
router.get('/get_property_features/:id', getPropertyFeatures)
router.get('/get_all_properties', getProperties)
router.put('/update_property/:id', verifySellerToken, updateProperty)
router.put('/update_property_features/:id', verifySellerToken, updatePropertyFeatures)
router.delete('/delete_property/:id', verifySellerToken, deleteProperty);
router.post('/upload_images/:id', verifySellerToken, upload.array('images', 30), uploadImages)
router.get('/get_image/:filename', getImage)
router.delete('/delete_images/:id', verifySellerToken, deleteImages)

export default router;