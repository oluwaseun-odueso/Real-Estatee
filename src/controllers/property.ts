import {Request, Response} from 'express';
import { addAddress, deletePropertyAddress, updateAddressDetails } from '../functions/addressFunctions';
import { deletePropertyFeatures } from '../functions/propertyFeaturesFunctions';
import { 
    checkIfSellerHasProperty,
    createProperty, 
    deleteSellerProperty, 
    getFullPropertyDetails, 
    getPropertyById, 
    updatePropertyDetails
    } from '../functions/propertyFunctions';

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
    };
};

export async function getProperty(req: Request, res: Response) {
    try {
        const property_id = parseInt(req.params.id, 10)
        const property = await getPropertyById(property_id)
        if (!property) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        };

        const propertyDetails = await getFullPropertyDetails(property_id, property.address_id)
        res.status(200).send({ 
            success: true,
            propertyDetails
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error adding property.',
            error: error.message
        });
    };
};

export async function updateProperty(req: Request, res: Response) {
    try {
        if (!req.body.description || !req.body.type || !req.body.street || !req.body.price) {
            res.status(400).json({ 
                success: false, 
                message: "Please enter all required fields"
            });
            return;
        };

        const property_id = parseInt(req.params.id, 10)
        const property = await getPropertyById(property_id)
        if (! await checkIfSellerHasProperty(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        };

        const {description, type, street, city, state, country, postal_code, price} = req.body;
        await updatePropertyDetails(property_id, description, type, price)
        await updateAddressDetails(property.address_id, street, city, state, country, postal_code)
        const new_details = await getFullPropertyDetails(property_id, property.address_id)

        res.status(200).send({
            success: true,
            message: "Your property's details has been updated!", 
            new_details
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error updating property details.',
            error: error.message
        });
    };
};

export async function deleteProperty(req: Request, res: Response) {
    try {
        const property_id = parseInt(req.params.id, 10)
        if (!await checkIfSellerHasProperty(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        };

        const property = await getPropertyById(property_id)
        await deletePropertyAddress(property.address_id)
        await deletePropertyFeatures(property_id)
        await deleteSellerProperty(property_id, req.seller.id)
        res.status(200).send({
            success: true,
            message: "Property has been deleted!"
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting property details.',
            error: error.message
        });
    }
}