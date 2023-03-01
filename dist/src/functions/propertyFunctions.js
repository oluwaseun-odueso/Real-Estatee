"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfPropertyExists = exports.createProperty = void 0;
const property_1 = require("../models/property");
async function createProperty(propertyDetails) {
    try {
        const property = await property_1.Property.create(propertyDetails);
        return JSON.parse(JSON.stringify(property));
    }
    catch (error) {
        throw new Error(`Error adding property for sale: ${error}`);
    }
    ;
}
exports.createProperty = createProperty;
;
async function checkIfPropertyExists(id, seller_id) {
    try {
        const featureExists = await property_1.Property.findOne({
            where: { id, seller_id }
        });
        return featureExists ? true : false;
    }
    catch (error) {
        throw new Error(`Error checking if property exists: ${error}`);
    }
    ;
}
exports.checkIfPropertyExists = checkIfPropertyExists;
;
