"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePropertyFeatures = exports.CheckIffeatureAlreadyExistsOnProperty = exports.updateFeatures = exports.getFeaturesForProperty = exports.addFeature = void 0;
const propertyFeatures_1 = require("../models/propertyFeatures");
async function addFeature(propertyFeatureDetails) {
    try {
        const feature = await propertyFeatures_1.PropertyFeatures.create(propertyFeatureDetails);
        return JSON.parse(JSON.stringify(feature));
    }
    catch (error) {
        throw new Error(`Error adding feature to property: ${error}`);
    }
    ;
}
exports.addFeature = addFeature;
;
async function getFeaturesForProperty(property_id) {
    try {
        const features = await propertyFeatures_1.PropertyFeatures.findAll({
            attributes: { exclude: ['id', 'property_id', 'createdAt', 'updatedAt'] },
            where: { property_id }
        });
        return JSON.parse(JSON.stringify(features));
    }
    catch (error) {
        throw new Error(`Error getting feature(s): ${error}`);
    }
    ;
}
exports.getFeaturesForProperty = getFeaturesForProperty;
;
async function updateFeatures(property_id, feature_id, number) {
    try {
        const updated = await propertyFeatures_1.PropertyFeatures.update({ feature_id, number }, {
            where: { property_id }
        });
        return updated;
    }
    catch (error) {
        throw new Error(`Error updating seller details: ${error}`);
    }
    ;
}
exports.updateFeatures = updateFeatures;
;
async function CheckIffeatureAlreadyExistsOnProperty(property_id, feature_id) {
    try {
        const featureExists = await propertyFeatures_1.PropertyFeatures.findOne({
            where: { property_id, feature_id }
        });
        return featureExists ? true : false;
    }
    catch (error) {
        throw new Error(`Error checking if feature already exists on property: ${error}`);
    }
    ;
}
exports.CheckIffeatureAlreadyExistsOnProperty = CheckIffeatureAlreadyExistsOnProperty;
;
async function deletePropertyFeatures(property_id) {
    try {
        const deletedFeatures = await propertyFeatures_1.PropertyFeatures.destroy({
            where: { property_id }
        });
        return deletedFeatures;
    }
    catch (error) {
        throw new Error(`Error deleting property's features: ${error}`);
    }
    ;
}
exports.deletePropertyFeatures = deletePropertyFeatures;
;
