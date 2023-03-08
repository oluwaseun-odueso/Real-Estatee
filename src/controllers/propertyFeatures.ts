import {Request, Response} from 'express';
import { checkIfFeatureExists } from '../functions/featuresFunctions';
import { checkIfSellerHasProperty } from '../functions/propertyFunctions';
import { addFeature, CheckIffeatureAlreadyExistsOnProperty, getFeaturesForProperty, updateFeatures } from '../functions/propertyFeaturesFunctions';

export async function addPropertyFeature (req: Request, res: Response) {
    try {
        const property_id = parseInt(req.params.id, 10)
        if (! await checkIfSellerHasProperty(property_id, req.seller.id)) { 
            res.status(400).send({ 
                success: false, 
                message: "You cannot add features to a non-existent property"}) 
            return;
        };

        if (!req.body.feature_id || !req.body.number) {
            res.status(400).json({ 
                success: false, 
                message: "Please add all necessary details "
            });
            return;
        };

        const {feature_id, number } = req.body;
        if (! await checkIfFeatureExists(feature_id)) { 
            res.status(400).send({ 
                success: false, 
                message: "This feature does not exist, you can add extra features in the other properties box below"}) 
            return;
        };

        if ( await CheckIffeatureAlreadyExistsOnProperty(property_id, feature_id)) {
            res.status(400).send({ 
                success: false, 
                message: "This feature already exists for this property, update to make changes or add another feature"}) 
            return;
        }

        await addFeature({property_id, feature_id, number});
        const features = await getFeaturesForProperty(property_id)
        res.status(201).send({ success: true, message : "New feature added", features})   
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
        const property_id = parseInt(req.params.id, 10)
        const features = await getFeaturesForProperty(property_id)
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
    };
};

export async function updatePropertyFeatures (req: Request, res: Response) {
    try {
        const property_id = parseInt(req.params.id, 10)
        if (! await checkIfSellerHasProperty(property_id, req.seller.id)) { 
            res.status(400).send({ 
                success: false, 
                message: "You cannot update features of a non-existent property"}) 
            return;
        };

        if (!req.body.feature_id || !req.body.number) {
            res.status(400).json({ 
                success: false, 
                message: "Please add all necessary details "
            });
            return;
        };

        const { feature_id, number } = req.body;

        if (! await checkIfFeatureExists(feature_id)) { 
            res.status(400).send({ 
                success: false, 
                message: "This feature does not exist, you can add extra features in the other properties below"}) 
            return;
        };
        await updateFeatures(property_id, feature_id, number)
        const updated_features = await getFeaturesForProperty(property_id)

        res.status(200).send({
            success: true,
            message: "Your property's details has been updated!", 
            updated_features
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error updating property's features",
            error: error.message
        });
    };
};