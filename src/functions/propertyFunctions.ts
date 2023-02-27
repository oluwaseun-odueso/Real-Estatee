import {Property} from '../models/property';
import {CustomProperty} from '../types/custom';

export type PropertyType = {
    seller_id: number,
    address_id: number,
    description: string,
    type: string,
    price: string
};

export async function createProperty(propertyDetails: PropertyType): Promise<CustomProperty> {
    try {
        const property = await Property.create(propertyDetails)
        return JSON.parse(JSON.stringify(property))
    } catch (error) {
        throw new Error(`Error adding property for sale: ${error}`)
    };
};

export async function checkIfPropertyExists (id: number, seller_id: number): Promise<boolean> {
    try {
        const featureExists = await Property.findOne({
            where: { id, seller_id }
        })
        return featureExists ? true : false
    } catch (error) {
        throw new Error(`Error checking if property exists: ${error}`)
    };
};