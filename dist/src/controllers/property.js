"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProperty = void 0;
const addressFunctions_1 = require("../functions/addressFunctions");
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
}
exports.addProperty = addProperty;
