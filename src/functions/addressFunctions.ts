import {Address} from '../models/address';
import {CustomAddress} from '../types/custom';

export type AddressType = {
    street: string,
    city?: string,
    state: string,
    country: string,
    postal_code?: number 
}

export async function addAddress(addressDetails: AddressType): Promise<CustomAddress> {
    try {
        const address = await Address.create(addressDetails)
        return JSON.parse(JSON.stringify(address))
    } catch (error) {
        throw new Error(`Error adding address: ${error}`)
    };
};

export async function getAddressById(id: number): Promise<CustomAddress> {
    try {
        const address = await Address.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt']},
            where: { id }
        });
        return JSON.parse(JSON.stringify(address))
    } catch (error) {
        throw new Error(`Error getting address by id: ${error}`)
    };
};

export async function getOnlyAddressDetails(id: number): Promise<CustomAddress> {
    try {
        const address = await Address.findOne({
            attributes: { exclude: ['id', 'createdAt', 'updatedAt']},
            where: { id }
        });
        return JSON.parse(JSON.stringify(address))
    } catch (error) {
        throw new Error(`Error getting address by id: ${error}`)
    };
};

export async function updateAddressDetails(id: number, street: string, city: string, state: string, country: string, postal_code: number) {
    try {
        const updated = await Address.update({street, city, state, country, postal_code}, {
            where: { id }
        });
        return updated
    } catch (error) {
        throw new Error(`Error updating address details: ${error}`)
    };
};