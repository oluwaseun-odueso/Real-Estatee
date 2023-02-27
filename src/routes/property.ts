import express from 'express';
import { verifySellerToken } from '../auth/jwtAuth'

import { 
    addProperty 
} from '../controllers/property';

import { 
    addPropertyFeature 
} from '../controllers/propertyFeatures';

const router = express.Router()

router.post('/put_property_for_sale', verifySellerToken, addProperty);
router.post('/add_property_features', verifySellerToken, addPropertyFeature)

export default router;