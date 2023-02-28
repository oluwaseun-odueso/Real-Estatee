"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFeature = void 0;
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
