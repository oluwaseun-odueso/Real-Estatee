import {Request, Response} from 'express';
import dotenv from 'dotenv';
import { getPropertyById } from '../functions/propertyFunctions';
import { getBuyerById } from '../functions/buyerFunctions';
import {createData, createTransaction} from '../functions/transactionFunctions'
import Transaction from '../util/transaction';

dotenv.config();

export const initiateTransaction = async(req: Request, res: Response) => {
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
            message: 'Error initiating transaction.',
            error: error.message
        });
    }
}