import {Request, Response, NextFunction} from 'express';
import { addAddress } from '../functions/addressFunctions';
import { createProperty } from '../functions/propertyFunctions';

export async function addProperty(req: Request, res: Response) {
    try {
        if (!req.body.description || !req.body.type || !req.body.street || !req.body.city || !req.body.state || !req.body.country || !req.body.price) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter all required fields"
            });
            return;
        };

        const {description, type, street, city, state, country, price} = req.body;
        const address = await addAddress({street, city, state, country});
        const address_id = address.id;
        const seller_id = req.seller.id
        const property = await createProperty({seller_id, address_id, description, type, price})
        res.status(201).send({ success: true, message : "You have successfully put up a new property for sale", property})   
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error adding property.',
            error: error.message
        });
    }
}