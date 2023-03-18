import { Buyer } from '../models/buyer'
import { CustomBuyer } from '../types/custom';
import bcrypt from 'bcrypt';
import { getOnlyAddressDetails } from './addressFunctions';

export type BuyerType = {
    address_id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    image_key?: string,
    hashed_password: string, 
};

export async function createBuyer(buyerDetails: BuyerType): Promise<CustomBuyer> {
    try {
        const buyer = await Buyer.create(buyerDetails)
        return JSON.parse(JSON.stringify(buyer))
    } catch (error) {
        throw new Error(`Error creating buyer: ${error}`)
    };
};

export async function checkBuyerEmail (email: string): Promise<boolean> {
    try {
        const emailCheck = await Buyer.findOne({
            where: { email }
        })
        return emailCheck ? true : false
    } catch (error) {
        throw new Error(`Error checking if buyer's email exists: ${error}`)
    };
};

export async function checkBuyerPhoneNumber(phone_number: string): Promise<boolean> {
    try {
        const phoneNumberCheck = await Buyer.findOne({
            where: {phone_number}
        })
        return phoneNumberCheck ? true : false
    } catch (error) {
        throw new Error(`Error checking if buyer's phone_number exists: ${error}`)
    };
};

export async function hashBuyerPassword (password: string): Promise<string> {
    try {
        const saltRounds: number = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash
    } catch (error) {
        throw new Error(`Error hashing buyer's password: ${error}`);
    };
};

export async function getBuyerByEmail(email: string): Promise<CustomBuyer> {
    try {
        const buyer = await Buyer.findOne({
            attributes: { exclude: ['hashed_password' ,'image_key', 'createdAt', 'updatedAt']},
            where: { email }
        })
        return JSON.parse(JSON.stringify(buyer))
    } catch (error) {
        throw new Error(`Error getting buyer by email: ${error}`)
    };
};

export async function getBuyerById(id: number): Promise<CustomBuyer> {
    try {
        const buyer = await Buyer.findOne({
            attributes: { exclude: ['hashed_password' ,'image_key', 'createdAt', 'updatedAt']},
            where: { id }
        })
        return JSON.parse(JSON.stringify(buyer))
    } catch (error) {
        throw new Error(`Error getting buyer by id: ${error}`)
    };
};


export async function retrieveBuyerHashedPassword(email: string): Promise<string> {
    try {
        const buyerPassword = await Buyer.findOne({
            attributes: ["hashed_password"],
            where: {email}
        });
        return JSON.parse(JSON.stringify(buyerPassword)).hashed_password;
    } catch (error) {
        throw new Error(`Error retrieving buyer's password: ${error}`)
    };
};

export async function confirmBuyerRetrievedPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const confirmPassword = await bcrypt.compare(password, hashedPassword)
        return confirmPassword;
    } catch (error) {
        throw new Error(`Error comfirming buyer's password: ${error}`)
    };
};

export async function getFullBuyerDetails(buyer_id: number, buyer_address_id: number) {
    try {
        const buyerDetails = await getBuyerById(buyer_id);
        const address_details = await getOnlyAddressDetails(buyer_address_id);

        const buyerFullDetails = {...buyerDetails, address_details}
        return buyerFullDetails;
    } catch (error) {
        throw new Error(`Error getting buyer's full details: ${error}`)
    };
};

export function checkIfEntriesMatch(firstValue: string, secondValue: string): boolean {
    return firstValue === secondValue;
};

export async function updateBuyerAccountDetails(id: number, first_name: string, last_name: string, email: string, phone_number: string) {
    try {
        const updatedDetails = await Buyer.update({first_name, last_name, email, phone_number}, {
            where: { id }
        });
        return updatedDetails
    } catch (error) {
        throw new Error(`Error updating buyer's details: ${error}`)
    };
};

export async function updatePassword (id: number, hashed_password: string) {
    try {
        const updatedPassword = await Buyer.update({hashed_password}, {
            where: {id}
        })
        return updatedPassword
    } catch (error) {
        throw new Error(`Error updating buyer's password: ${error}`)
    }
}

export async function deleteAccount(id: number): Promise<number> {
    try {
        const deletedAccount = await Buyer.destroy({
            where: {id}
        })
        return deletedAccount;
    } catch (error) {
        throw new Error(`Error deleting buyer's account: ${error}`)
    };
};