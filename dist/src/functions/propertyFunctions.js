"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSellerProperty = exports.updatePropertyDetails = exports.getFullPropertyDetails = exports.getPropertyById = exports.checkIfSellerHasProperty = exports.createProperty = exports.getManyProperties = void 0;
const property_1 = require("../models/property");
const addressFunctions_1 = require("./addressFunctions");
const propertyFeaturesFunctions_1 = require("./propertyFeaturesFunctions");
;
async function getManyProperties(query) {
    const properties = await property_1.Property.findAll({
        limit: query.limit,
        offset: (query.page - 1) * 20
    });
    return properties;
}
exports.getManyProperties = getManyProperties;
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
async function checkIfSellerHasProperty(id, seller_id) {
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
exports.checkIfSellerHasProperty = checkIfSellerHasProperty;
;
async function getPropertyById(id) {
    try {
        const property = await property_1.Property.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { id }
        });
        return JSON.parse(JSON.stringify(property));
    }
    catch (error) {
        throw new Error(`Error getting property by id: ${error}`);
    }
}
exports.getPropertyById = getPropertyById;
;
async function getFullPropertyDetails(property_id, property_address_id) {
    try {
        const propertyDetails = await getPropertyById(property_id);
        const address_details = await (0, addressFunctions_1.getOnlyAddressDetails)(property_address_id);
        const features = await (0, propertyFeaturesFunctions_1.getFeaturesForProperty)(property_id);
        const propertyFullDetails = { ...propertyDetails, address_details, features };
        return propertyFullDetails;
    }
    catch (error) {
        throw new Error(`Error getting seller full details: ${error}`);
    }
    ;
}
exports.getFullPropertyDetails = getFullPropertyDetails;
;
async function updatePropertyDetails(id, description, type, price) {
    try {
        const updated = await property_1.Property.update({ description, type, price }, {
            where: { id }
        });
        return updated;
    }
    catch (error) {
        throw new Error(`Error updating property details: ${error}`);
    }
    ;
}
exports.updatePropertyDetails = updatePropertyDetails;
;
async function deleteSellerProperty(id, seller_id) {
    try {
        const deletedProperty = await property_1.Property.destroy({
            where: { id, seller_id }
        });
        return deletedProperty;
    }
    catch (error) {
        throw new Error(`Error deleting seller property: ${error}`);
    }
    ;
}
exports.deleteSellerProperty = deleteSellerProperty;
;
