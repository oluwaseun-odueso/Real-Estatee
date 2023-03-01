"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPropertyFeature = void 0;
const featuresFunctions_1 = require("../functions/featuresFunctions");
const propertyFunctions_1 = require("../functions/propertyFunctions");
const propertyFeaturesFunctions_1 = require("../functions/propertyFeaturesFunctions");
async function addPropertyFeature(req, res) {
    try {
        if (!req.body.property_id || !req.body.feature_id || !req.body.number) {
            res.status(400).json({
                success: false,
                message: "Please add all necessary details "
            });
            return;
        }
        ;
        const { property_id, feature_id, number } = req.body;
        if (!await (0, propertyFunctions_1.checkIfPropertyExists)(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "You cannot add features to a non-existent property"
            });
            return;
        }
        ;
        if (!await (0, featuresFunctions_1.checkIfFeatureExists)(feature_id)) {
            res.status(400).send({
                success: false,
                message: "This feature does not exist, you can add extra features in the other properties box below"
            });
            return;
        }
        ;
        await (0, propertyFeaturesFunctions_1.addFeature)({ property_id, feature_id, number });
        res.status(201).send({ success: true, message: "New feature added" });
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
