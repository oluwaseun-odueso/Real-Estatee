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