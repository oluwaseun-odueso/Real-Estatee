import { PropertyImages } from '../models/propertyImages';
import { CustomPropertyImages } from '../types/custom';

export type PropertyImagesType = {
    property_id: number,
    image_key: string,
    image_url: string
};

export async function createPropertyImage(propertyImageDetails: PropertyImagesType): Promise<CustomPropertyImages> {
    try {
        const imageDetails = await PropertyImages.create(propertyImageDetails)
        return JSON.parse(JSON.stringify(imageDetails))
    } catch (error) {
        throw new Error(`Error adding property for sale: ${error}`)
    };
};

