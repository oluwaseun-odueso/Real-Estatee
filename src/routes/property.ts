import express from 'express';
import { verifySellerToken } from '../auth/sellerAuth'

import { 
    addProperty, 
    deleteProperty, 
    getProperty, 
    updateProperty 
} from '../controllers/property';

import { 
    addPropertyFeature, 
    getPropertyFeatures, 
    updatePropertyFeatures 
} from '../controllers/propertyFeature';

const router = express.Router()

router.post('/put_property_for_sale', verifySellerToken, addProperty);
router.post('/add_property_features/:id', verifySellerToken, addPropertyFeature)
router.get('/get_property/:id', getProperty)
router.get('/get_property_features/:id', getPropertyFeatures)
router.put('/update_property/:id', verifySellerToken, updateProperty)
router.put('/updated_property_features/:id', verifySellerToken, updatePropertyFeatures)
router.delete('/delete_property/:id', verifySellerToken, deleteProperty)

export default router;