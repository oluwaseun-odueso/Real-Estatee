import {Property} from '../models/property';
import {CustomProperty} from '../types/custom';
import { getOnlyAddressDetails } from './addressFunctions';

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

export async function getPropertyById (id: number): Promise<CustomProperty> {
    try {
        const property = await Property.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt']},
            where: { id }
        });
        return JSON.parse(JSON.stringify(property))
    } catch (error) {
        throw new Error(`Error getting property by id: ${error}`)
    }
};

export async function getFullPropertyDetails(property_id: number, property_address_id: number) {
    try {
        const propertyDetails = await getPropertyById(property_id);
        const address_details = await getOnlyAddressDetails(property_address_id);

        const propertyFullDetails = {...propertyDetails, address_details}
        return propertyFullDetails;
    } catch (error) {
        throw new Error(`Error getting seller full details: ${error}`)
    };
};
