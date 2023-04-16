import {Request, Response} from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { getPropertyById } from '../functions/propertyFunctions';
import { getBuyerById } from '../functions/buyerFunctions';
import {createData, createTransaction, getTransactionById, updateTransactionStatus} from '../functions/transactionFunctions'
import Transaction from '../util/transaction';

dotenv.config();
const secret = process.env.PAYSTACK_TOKEN!;

export async function initiateTransaction (req: Request, res: Response) {
    try {
        const property = await getPropertyById(parseInt(req.params.property_id, 10))
        const buyer = await getBuyerById(req.buyer.id)
        const data = await createData(req.buyer.id, property.id, property.seller_id, buyer.email, property.price)
        const payment = await Transaction.initializeTransaction(data)
        await createTransaction(property.id, req.buyer.id, property.seller_id, property.price, payment.reference, "pending", new Date)
        res.status(201).send({
            success: true,
            message: "Kindly pay through the link below", 
            reference: payment.reference, 
            link: payment.authorization_url
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error initiating transaction',
            error: error.message
        });
    };
};

export async function getTransaction (req: Request, res: Response) {
    try {
        const transaction = await getTransactionById(parseInt(req.params.transaction_id, 10))
        if (!transaction) {
            res.status(400).send({
                success: false,
                message: "Transaction not found"
            });
            return;
        };
        res.status(200).send({ 
            success: true,
            transaction
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error getting transaction',
            error: error.message
        });
    };
};

export async function updateTransaction (req: Request, res: Response) {
    try {
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
        if (hash == req.headers['x-paystack-signature']) {
            const event = req.body
            if (event.event == "charge.success") {
                await updateTransactionStatus(event.data.reference, "paid")
                res.status(200).send({success: true, message: "Payment sucessful"})
                return
            }
        }
        res.status(200).json({
            success: false,
            message: "Payment failed"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error updating transaction",
            error: error.message
        })
    }
}