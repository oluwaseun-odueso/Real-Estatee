"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfFeatureExists = void 0;
const features_1 = require("../models/features");
// export async function addFeature(featureDetails: FeatureType): Promise<CustomFeature> {
//     try {
//         const feature = await Feature.create(featureDetails)
//         return JSON.parse(JSON.stringify(feature))
//     } catch (error) {
//         throw new Error(`Error adding feature to property: ${error}`)
//     };
// };
async function checkIfFeatureExists(id) {
    try {
        const featureExists = await features_1.Feature.findOne({
            where: { id }
        });
        return featureExists ? true : false;
    }
    catch (error) {
        throw new Error(`Error checking if feature exists: ${error}`);
    }
    ;
}
exports.checkIfFeatureExists = checkIfFeatureExists;
;
