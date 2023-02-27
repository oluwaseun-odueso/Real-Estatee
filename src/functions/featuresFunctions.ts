import {Feature} from '../models/features';
import {CustomFeature} from '../types/custom';

export type FeatureType = {
    feature: string
};

// export async function addFeature(featureDetails: FeatureType): Promise<CustomFeature> {
//     try {
//         const feature = await Feature.create(featureDetails)
//         return JSON.parse(JSON.stringify(feature))
//     } catch (error) {
//         throw new Error(`Error adding feature to property: ${error}`)
//     };
// };

export async function checkIfFeatureExists (id: number): Promise<boolean> {
    try {
        const featureExists = await Feature.findOne({
            where: { id }
        })
        return featureExists ? true : false
    } catch (error) {
        throw new Error(`Error checking if feature exists: ${error}`)
    };
};