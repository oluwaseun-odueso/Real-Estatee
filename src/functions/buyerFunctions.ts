import { Buyer } from '../models/buyer'
import { CustomBuyer } from '../types/custom';
import bcrypt from 'bcrypt';

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
