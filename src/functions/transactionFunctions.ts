import {Transaction} from '../models/transaction';
import dotenv from 'dotenv';

dotenv.config();
const subAccount = process.env.PAYSTACK_SUBACCOUNT!;

export type TransactionType = {
    property_id: number,
    buyer_id: number, 
    seller_id: number,
    price: number,
    reference: string,
    payment_status: string,
    transaction_date: Date
};

export async function createTransaction(property_id: number, buyer_id: number, seller_id: number, price: number, reference: string, payment_status: string, transaction_date: Date) {
    try {
        const newTransaction = await Transaction.create({property_id, buyer_id, seller_id, price, reference, payment_status, transaction_date})
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
            "payment_status": "Pending",
            "subaccount": subAccount,
            "bearer": "subaccount"
        })
        return data
    } catch (error) {
        throw new Error(`Error creating transaction data: ${error}`)
    };
};

export async function getTransactionById (id: number): Promise<TransactionType> {
    try {
        const transaction = await Transaction.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt']},
            where: { id }
        });
        return JSON.parse(JSON.stringify(transaction))
    } catch (error) {
        throw new Error(`Error getting transaction by id: ${error}`)
    }
};

export async function updateTransactionStatus(reference: string, payment_status: string) {
    try {
        const updatedTransactionStatus = await Transaction.update({payment_status}, {
            where: { reference }
        })
        return updatedTransactionStatus
    } catch (error) {
        return error
    }
}