"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressDetails = exports.getOnlyAddressDetails = exports.getAddressById = exports.addAddress = void 0;
const address_1 = require("../models/address");
async function addAddress(addressDetails) {
    try {
        const address = await address_1.Address.create(addressDetails);
        return JSON.parse(JSON.stringify(address));
    }
    catch (error) {
        throw new Error(`Error adding address: ${error}`);
    }
    ;
}
exports.addAddress = addAddress;
;
async function getAddressById(id) {
    try {
        const address = await address_1.Address.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { id }
        });
        return JSON.parse(JSON.stringify(address));
    }
    catch (error) {
        throw new Error(`Error getting address by id: ${error}`);
    }
    ;
}
exports.getAddressById = getAddressById;
;
async function getOnlyAddressDetails(id) {
    try {
        const address = await address_1.Address.findOne({
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
            where: { id }
        });
        return JSON.parse(JSON.stringify(address));
    }
    catch (error) {
        throw new Error(`Error getting address by id: ${error}`);
    }
    ;
}
exports.getOnlyAddressDetails = getOnlyAddressDetails;
;
async function updateAddressDetails(id, street, city, state, country, postal_code) {
    try {
        const updated = await address_1.Address.update({ street, city, state, country, postal_code }, {
            where: { id }
        });
        return updated;
    }
    catch (error) {
        throw new Error(`Error updating address details: ${error}`);
    }
    ;
}
exports.updateAddressDetails = updateAddressDetails;
;
