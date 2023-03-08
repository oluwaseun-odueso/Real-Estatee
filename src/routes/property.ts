import express from 'express';
import { verifySellerToken } from '../auth/jwtAuth'

import { 
    addProperty, getProperty, updateProperty 
} from '../controllers/property';

import { 
    addPropertyFeature, getPropertyFeatures 
} from '../controllers/propertyFeatures';

const router = express.Router()

router.post('/put_property_for_sale', verifySellerToken, addProperty);
router.post('/add_property_features', verifySellerToken, addPropertyFeature)
router.get('/get_property/:id', getProperty)
router.get('/get_property_features/:id', getPropertyFeatures)
router.put('/update_property/:id', verifySellerToken, updateProperty)

export default router;