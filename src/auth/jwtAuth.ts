import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { SellerType } from '../functions/sellerFunctions';
import { CustomSeller } from '../types/custom';
require('dotenv').config();

const secretKey = process.env.PAYLOAD_SECRET as string;
if (!secretKey) {
    throw new Error('Missing required environment variable for Seller Authentication');
};

export function generateSellerToken(payload: SellerType): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, {expiresIn: '10m'}, (error, token) => {
            if (error) { 
                reject(error) 
            } else resolve(token as string)
        });
    });
};

export async function verifySellerToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).send({
            error: 'You are unauthorized to perform this operation.'
        });
    }

    try {
        const seller = jwt.verify(token, secretKey) as CustomSeller;
        req.seller = seller;
        next();
    } catch (error) {
        return res.status(403).send({
            error: "Session expired! please login to perform operation."
        });
    };
};