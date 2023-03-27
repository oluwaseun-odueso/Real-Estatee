import {Seller} from '../models/seller';
import {CustomSeller} from '../types/custom';
import bcrypt from 'bcrypt';
import { getOnlyAddressDetails } from './addressFunctions';

export type SellerType = {
    address_id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    image_key?: string,
    hashed_password: string, 
};


export async function createSeller(sellerDetails: SellerType): Promise<CustomSeller> {
    try {
        const seller = await Seller.create(sellerDetails)
        return JSON.parse(JSON.stringify(seller))
    } catch (error) {
        throw new Error(`Error creating seller: ${error}`)
    };
};

export async function checkEmail (email: string): Promise<boolean> {
    try {
        const emailCheck = await Seller.findOne({
            where: { email }
        })
        return emailCheck ? true : false
    } catch (error) {
        throw new Error(`Error checking if seller's email exists: ${error}`)
    };
};

export async function checkPhoneNumber(phone_number: string): Promise<boolean> {
    try {
        const phoneNumberCheck = await Seller.findOne({
            where: {phone_number}
        })
        return phoneNumberCheck ? true : false
    } catch (error) {
        throw new Error(`Error checking if seller's phone_number exists: ${error}`)
    };
};

export async function hashPassword (password: string): Promise<string> {
    try {
        const saltRounds: number = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash
    } catch (error) {
        throw new Error(`Error hashing seller's password: ${error}`);
    };
};

export async function getSellerByEmail(email: string): Promise<CustomSeller> {
    try {
        const seller = await Seller.findOne({
            attributes: { exclude: ['hashed_password' ,'image_key', 'createdAt', 'updatedAt']},
            where: { email }
        })
        return JSON.parse(JSON.stringify(seller))
    } catch (error) {
        throw new Error(`Error getting seller by email: ${error}`)
    };
};

export async function retrieveSellerHashedPassword(email: string): Promise<string> {
    try {
        const sellerPassword = await Seller.findOne({
            attributes: ["hashed_password"],
            where: {email}
        });
        return JSON.parse(JSON.stringify(sellerPassword)).hashed_password;
    } catch (error) {
        throw new Error(`Error retrieving seller's password: ${error}`)
    };
};

export async function confirmSellerRetrievedPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const confirmPassword = await bcrypt.compare(password, hashedPassword)
        return confirmPassword;
    } catch (error) {
        throw new Error(`Error comfirming seller's password: ${error}`)
    };
};

export async function getSellerById(id: number): Promise<CustomSeller> {
    try {
        const seller = await Seller.findOne({
            attributes: { exclude: ['hashed_password' ,'image_key', 'createdAt', 'updatedAt']},
            where: { id }
        })
        return JSON.parse(JSON.stringify(seller))
    } catch (error) {
        throw new Error(`Error getting seller by id: ${error}`)
    };
};

export async function getSellerWithoutAddressId(id: number) {
    try {
        const seller = await Seller.findOne({
            attributes: { exclude: ['address_id', 'hashed_password' ,'image_key', 'createdAt', 'updatedAt']},
            where: { id }
        })
        return JSON.parse(JSON.stringify(seller))
    } catch (error) {
        throw new Error(`Error getting only seller's address details by id: ${error}`)
    };
};

export async function getFullSellerDetails(seller_id: number, seller_address_id: number) {
    try {
        const sellerDetails = await getSellerById(seller_id);
        const address_details = await getOnlyAddressDetails(seller_address_id);

        const sellerFullDetails = {...sellerDetails, address_details}
        return sellerFullDetails;
    } catch (error) {
        throw new Error(`Error getting seller's full details: ${error}`)
    };
};

export function checkIfEntriesMatch(firstValue: string, secondValue: string): boolean {
    return firstValue === secondValue;
};

export async function updateSellerAccountDetails(id: number, first_name: string, last_name: string, email: string, phone_number: string) {
    try {
        const updated = await Seller.update({first_name, last_name, email, phone_number}, {
            where: { id }
        });
        return updated
    } catch (error) {
        throw new Error(`Error updating seller's details: ${error}`)
    };
};

export async function updatePassword (id: number, hashed_password: string) {
    try {
        const updatedPassword = await Seller.update({hashed_password}, {
            where: {id}
        })
        return updatedPassword
    } catch (error) {
        throw new Error(`Error updating seller's password: ${error}`)
    }
}

export async function deleteSellerAccount(id: number): Promise<number> {
    try {
        const deletedAccount = await Seller.destroy({
            where: {id}
        })
        return deletedAccount;
    } catch (error) {
        throw new Error(`Error deleting seller's account: ${error}`)
    };
};

export async function saveSellerImageUrlAndKey(id: number, image_key: string, image_url: string) {
    try {
        const updated = await Seller.update({image_key, image_url}, {
            where: { id }
        })
        return updated
    } catch (error) {
        throw new Error(`Error saving seller's profile photo image url and key: ${error}`)
    };
};

export async function deleteSellerImage(id: number) {
    try {
        const updated = await Seller.update({image_key: null, image_url: null}, {
            where: { id }
        })
        return updated
    } catch (error) {
        throw new Error(`Error deleting seller's image: ${error}`)
    };
};
