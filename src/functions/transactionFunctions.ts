import {Transaction} from '../models/transaction';
import { getBuyerById } from './buyerFunctions';

export type SellerType = {
    address_id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    image_key?: string,
    hashed_password: string, 
};

export type PurchaseType = {
    buyer_id: number, 
    buyer_email: number,
    property_id: number,
    amount: number,
}

export async function createTransaction(transactionDetails: SellerType) {
    try {
        const newTransaction = await Transaction.create(transactionDetails)
        return JSON.parse(JSON.stringify(newTransaction))
    } catch (error) {
        throw new Error(`Error adding a new transaction: ${error}`)
    };
};

export async function createData(buyer_id: number, property_id: number, seller_id: number, email: string, price: number) {
    try {
        const data = JSON.stringify({
            "buyer_id": buyer_id,
            "property_id": property_id,
            "seller_id": seller_id,
            "email": email,
            "amount": price * 100,
            // "payment_status": order.dataValues.payment_status
        })
        return data
    } catch (error) {
        return error
    }
}