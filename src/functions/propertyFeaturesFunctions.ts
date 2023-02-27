import {PropertyFeatures} from '../models/propertyFeatures';
import { CustomPropertyFeature } from '../types/custom';
// import {} from '../types/custom';

export type PropertyFeatureType = {
    property_id: number,
    feature_id: number,
    number: number
};

export async function addFeature(propertyFeatureDetails: PropertyFeatureType): Promise<CustomPropertyFeature> {
    try {
        const feature = await PropertyFeatures.create(propertyFeatureDetails)
        return JSON.parse(JSON.stringify(feature))
    } catch (error) {
        throw new Error(`Error adding feature to property: ${error}`)
    };
};
