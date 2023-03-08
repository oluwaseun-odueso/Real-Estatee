import {Request, Response} from 'express';
import { checkIfFeatureExists } from '../functions/featuresFunctions';
import { checkIfSellerHasProperty } from '../functions/propertyFunctions';
import { addFeature, getFeatures } from '../functions/propertyFeaturesFunctions';

export async function addPropertyFeature (req: Request, res: Response) {
    try {
        if (!req.body.property_id || !req.body.feature_id || !req.body.number) {
            res.status(400).json({ 
                success: false, 
                message: "Please add all necessary details "
            });
            return;
        };

        const { property_id, feature_id, number } = req.body;

        if (! await checkIfSellerHasProperty(property_id, req.seller.id)) { 
            res.status(400).send({ 
                success: false, 
                message: "You cannot add features to a non-existent property"}) 
            return;
        };

        if (! await checkIfFeatureExists(feature_id)) { 
            res.status(400).send({ 
                success: false, 
                message: "This feature does not exist, you can add extra features in the other properties box below"}) 
            return;
        };

        await addFeature({property_id, feature_id, number});
        res.status(201).send({ success: true, message : "New feature added"})   
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error adding features to property',
            error: error.message
        });
    };
};

export async function getPropertyFeatures (req: Request, res: Response) {
    try {
        const propertyId = parseInt(req.params.id, 10)
        const features = await getFeatures(propertyId)
        if (!features) {
            res.status(400).send({
                success: false,
                message: "This property does not have any added feature"
            });
            return;
        }; 
        res.status(200).send({ 
            success: true,
            features
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error getting property's features",
            error: error.message
        });
    }
}