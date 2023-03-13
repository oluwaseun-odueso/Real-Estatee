"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getProperty = exports.addProperty = void 0;
const addressFunctions_1 = require("../functions/addressFunctions");
const propertyFeaturesFunctions_1 = require("../functions/propertyFeaturesFunctions");
const propertyFunctions_1 = require("../functions/propertyFunctions");
async function addProperty(req, res) {
    try {
        if (!req.body.description || !req.body.type || !req.body.street || !req.body.city || !req.body.state || !req.body.country || !req.body.price) {
            res.status(400).json({
                success: false,
                message: "Please enter all required fields"
            });
            return;
        }
        ;
        const { description, type, street, city, state, country, price } = req.body;
        const address = await (0, addressFunctions_1.addAddress)({ street, city, state, country });
        const address_id = address.id;
        const seller_id = req.seller.id;
        const property = await (0, propertyFunctions_1.createProperty)({ seller_id, address_id, description, type, price });
        res.status(201).send({ success: true, message: "You have successfully put up a new property for sale", property });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error adding property.',
            error: error.message
        });
    }
    ;
}
exports.addProperty = addProperty;
;
async function getProperty(req, res) {
    try {
        const property_id = parseInt(req.params.id, 10);
        const property = await (0, propertyFunctions_1.getPropertyById)(property_id);
        if (!property) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        }
        ;
        const propertyDetails = await (0, propertyFunctions_1.getFullPropertyDetails)(property_id, property.address_id);
        res.status(200).send({
            success: true,
            propertyDetails
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error adding property.',
            error: error.message
        });
    }
    ;
}
exports.getProperty = getProperty;
;
async function updateProperty(req, res) {
    try {
        if (!req.body.description || !req.body.type || !req.body.street || !req.body.price) {
            res.status(400).json({
                success: false,
                message: "Please enter all required fields"
            });
            return;
        }
        ;
        const property_id = parseInt(req.params.id, 10);
        const property = await (0, propertyFunctions_1.getPropertyById)(property_id);
        if (!await (0, propertyFunctions_1.checkIfSellerHasProperty)(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        }
        ;
        const { description, type, street, city, state, country, postal_code, price } = req.body;
        await (0, propertyFunctions_1.updatePropertyDetails)(property_id, description, type, price);
        await (0, addressFunctions_1.updateAddressDetails)(property.address_id, street, city, state, country, postal_code);
        const new_details = await (0, propertyFunctions_1.getFullPropertyDetails)(property_id, property.address_id);
        res.status(200).send({
            success: true,
            message: "Your property's details has been updated!",
            new_details
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating property details.',
            error: error.message
        });
    }
    ;
}
exports.updateProperty = updateProperty;
;
async function deleteProperty(req, res) {
    try {
        const property_id = parseInt(req.params.id, 10);
        if (!await (0, propertyFunctions_1.checkIfSellerHasProperty)(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        }
        ;
        const property = await (0, propertyFunctions_1.getPropertyById)(property_id);
        await (0, addressFunctions_1.deletePropertyAddress)(property.address_id);
        await (0, propertyFeaturesFunctions_1.deletePropertyFeatures)(property_id);
        await (0, propertyFunctions_1.deleteSellerProperty)(property_id, req.seller.id);
        res.status(200).send({
            success: true,
            message: "Property has been deleted!"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting property.',
            error: error.message
        });
    }
    ;
}
exports.deleteProperty = deleteProperty;
;
