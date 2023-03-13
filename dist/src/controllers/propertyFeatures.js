"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertyFeatures = exports.getPropertyFeatures = exports.addPropertyFeature = void 0;
const featuresFunctions_1 = require("../functions/featuresFunctions");
const propertyFunctions_1 = require("../functions/propertyFunctions");
const propertyFeaturesFunctions_1 = require("../functions/propertyFeaturesFunctions");
async function addPropertyFeature(req, res) {
    try {
        const property_id = parseInt(req.params.id, 10);
        if (!await (0, propertyFunctions_1.checkIfSellerHasProperty)(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "You cannot add features to a non-existent property"
            });
            return;
        }
        ;
        if (!req.body.feature_id || !req.body.number) {
            res.status(400).json({
                success: false,
                message: "Please add all necessary details "
            });
            return;
        }
        ;
        const { feature_id, number } = req.body;
        if (!await (0, featuresFunctions_1.checkIfFeatureExists)(feature_id)) {
            res.status(400).send({
                success: false,
                message: "This feature does not exist, you can add extra features in the other properties box below"
            });
            return;
        }
        ;
        if (await (0, propertyFeaturesFunctions_1.CheckIffeatureAlreadyExistsOnProperty)(property_id, feature_id)) {
            res.status(400).send({
                success: false,
                message: "This feature already exists for this property, update to make changes or add another feature"
            });
            return;
        }
        await (0, propertyFeaturesFunctions_1.addFeature)({ property_id, feature_id, number });
        const features = await (0, propertyFeaturesFunctions_1.getFeaturesForProperty)(property_id);
        res.status(201).send({ success: true, message: "New feature added", features });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error adding features to property',
            error: error.message
        });
    }
    ;
}
exports.addPropertyFeature = addPropertyFeature;
;
async function getPropertyFeatures(req, res) {
    try {
        const property_id = parseInt(req.params.id, 10);
        const features = await (0, propertyFeaturesFunctions_1.getFeaturesForProperty)(property_id);
        if (!features) {
            res.status(400).send({
                success: false,
                message: "This property does not have any added feature"
            });
            return;
        }
        ;
        res.status(200).send({
            success: true,
            features
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error getting property's features",
            error: error.message
        });
    }
    ;
}
exports.getPropertyFeatures = getPropertyFeatures;
;
async function updatePropertyFeatures(req, res) {
    try {
        const property_id = parseInt(req.params.id, 10);
        if (!await (0, propertyFunctions_1.checkIfSellerHasProperty)(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "You cannot update features of a non-existent property"
            });
            return;
        }
        ;
        if (!req.body.feature_id || !req.body.number) {
            res.status(400).json({
                success: false,
                message: "Please add all necessary details "
            });
            return;
        }
        ;
        const { feature_id, number } = req.body;
        if (!await (0, featuresFunctions_1.checkIfFeatureExists)(feature_id)) {
            res.status(400).send({
                success: false,
                message: "This feature does not exist, you can add extra features in the other properties below"
            });
            return;
        }
        ;
        await (0, propertyFeaturesFunctions_1.updateFeatures)(property_id, feature_id, number);
        const updated_features = await (0, propertyFeaturesFunctions_1.getFeaturesForProperty)(property_id);
        res.status(200).send({
            success: true,
            message: "Your property's details has been updated!",
            updated_features
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating property's features",
            error: error.message
        });
    }
    ;
}
exports.updatePropertyFeatures = updatePropertyFeatures;
;
