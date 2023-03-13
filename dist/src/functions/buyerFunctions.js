"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.updateBuyerAccountDetails = exports.checkIfEntriesMatch = exports.getFullBuyerDetails = exports.confirmBuyerRetrievedPassword = exports.retrieveBuyerHashedPassword = exports.getBuyerById = exports.getBuyerByEmail = exports.hashBuyerPassword = exports.checkBuyerPhoneNumber = exports.checkBuyerEmail = exports.createBuyer = void 0;
const buyer_1 = require("../models/buyer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const addressFunctions_1 = require("./addressFunctions");
async function createBuyer(buyerDetails) {
    try {
        const buyer = await buyer_1.Buyer.create(buyerDetails);
        return JSON.parse(JSON.stringify(buyer));
    }
    catch (error) {
        throw new Error(`Error creating buyer: ${error}`);
    }
    ;
}
exports.createBuyer = createBuyer;
;
async function checkBuyerEmail(email) {
    try {
        const emailCheck = await buyer_1.Buyer.findOne({
            where: { email }
        });
        return emailCheck ? true : false;
    }
    catch (error) {
        throw new Error(`Error checking if buyer's email exists: ${error}`);
    }
    ;
}
exports.checkBuyerEmail = checkBuyerEmail;
;
async function checkBuyerPhoneNumber(phone_number) {
    try {
        const phoneNumberCheck = await buyer_1.Buyer.findOne({
            where: { phone_number }
        });
        return phoneNumberCheck ? true : false;
    }
    catch (error) {
        throw new Error(`Error checking if buyer's phone_number exists: ${error}`);
    }
    ;
}
exports.checkBuyerPhoneNumber = checkBuyerPhoneNumber;
;
async function hashBuyerPassword(password) {
    try {
        const saltRounds = 10;
        const hash = await bcrypt_1.default.hash(password, saltRounds);
        return hash;
    }
    catch (error) {
        throw new Error(`Error hashing buyer's password: ${error}`);
    }
    ;
}
exports.hashBuyerPassword = hashBuyerPassword;
;
async function getBuyerByEmail(email) {
    try {
        const buyer = await buyer_1.Buyer.findOne({
            attributes: { exclude: ['hashed_password', 'image_key', 'createdAt', 'updatedAt'] },
            where: { email }
        });
        return JSON.parse(JSON.stringify(buyer));
    }
    catch (error) {
        throw new Error(`Error getting buyer by email: ${error}`);
    }
    ;
}
exports.getBuyerByEmail = getBuyerByEmail;
;
async function getBuyerById(id) {
    try {
        const buyer = await buyer_1.Buyer.findOne({
            attributes: { exclude: ['hashed_password', 'image_key', 'createdAt', 'updatedAt'] },
            where: { id }
        });
        return JSON.parse(JSON.stringify(buyer));
    }
    catch (error) {
        throw new Error(`Error getting buyer by id: ${error}`);
    }
    ;
}
exports.getBuyerById = getBuyerById;
;
async function retrieveBuyerHashedPassword(email) {
    try {
        const buyerPassword = await buyer_1.Buyer.findOne({
            attributes: ["hashed_password"],
            where: { email }
        });
        return JSON.parse(JSON.stringify(buyerPassword)).hashed_password;
    }
    catch (error) {
        throw new Error(`Error retrieving buyer's password: ${error}`);
    }
    ;
}
exports.retrieveBuyerHashedPassword = retrieveBuyerHashedPassword;
;
async function confirmBuyerRetrievedPassword(password, hashedPassword) {
    try {
        const confirmPassword = await bcrypt_1.default.compare(password, hashedPassword);
        return confirmPassword;
    }
    catch (error) {
        throw new Error(`Error comfirming buyer's password: ${error}`);
    }
    ;
}
exports.confirmBuyerRetrievedPassword = confirmBuyerRetrievedPassword;
;
async function getFullBuyerDetails(buyer_id, buyer_address_id) {
    try {
        const buyerDetails = await getBuyerById(buyer_id);
        const address_details = await (0, addressFunctions_1.getOnlyAddressDetails)(buyer_address_id);
        const buyerFullDetails = { ...buyerDetails, address_details };
        return buyerFullDetails;
    }
    catch (error) {
        throw new Error(`Error getting buyer's full details: ${error}`);
    }
    ;
}
exports.getFullBuyerDetails = getFullBuyerDetails;
;
function checkIfEntriesMatch(firstValue, secondValue) {
    return firstValue === secondValue;
}
exports.checkIfEntriesMatch = checkIfEntriesMatch;
;
async function updateBuyerAccountDetails(id, first_name, last_name, email, phone_number) {
    try {
        const updated = await buyer_1.Buyer.update({ first_name, last_name, email, phone_number }, {
            where: { id }
        });
        return updated;
    }
    catch (error) {
        throw new Error(`Error updating buyer's details: ${error}`);
    }
    ;
}
exports.updateBuyerAccountDetails = updateBuyerAccountDetails;
;
async function deleteAccount(id) {
    try {
        const deletedAccount = await buyer_1.Buyer.destroy({
            where: { id }
        });
        return deletedAccount;
    }
    catch (error) {
        throw new Error(`Error deleting buyer's account: ${error}`);
    }
    ;
}
exports.deleteAccount = deleteAccount;
;
