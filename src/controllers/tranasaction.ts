import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import { getPropertyById } from '../functions/propertyFunctions';
import { getBuyerById } from '../functions/buyerFunctions';
import {createData} from '../functions/transactionFunctions'

dotenv.config();

const initatePayment = async(req: Request, res: Response) => {
    try {
        const property = await getPropertyById(parseInt(req.params.id, 10))
        const buyer = await getBuyerById(req.buyer.id)
        const data = await createData(req.buyer.id, property.id, property.seller_id, buyer.email, property.price, )
    } catch (error: any) {
        
    }
}