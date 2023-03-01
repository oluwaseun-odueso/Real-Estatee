"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSellerImageKey = exports.deleteSellerAccount = exports.updateSellerAccountDetails = exports.checkIfEntriesMatch = exports.getFullSellerDetails = exports.getSellerWithoutAddressId = exports.getSellerById = exports.confirmRetrievedPassword = exports.retrieveHashedPassword = exports.getSellerByEmail = exports.hashPassword = exports.checkPhoneNumber = exports.checkEmail = exports.createSeller = void 0;
const seller_1 = require("../models/seller");
const bcrypt_1 = __importDefault(require("bcrypt"));
const addressFunctions_1 = require("./addressFunctions");
async function createSeller(sellerDetails) {
    try {
        const seller = await seller_1.Seller.create(sellerDetails);
        return JSON.parse(JSON.stringify(seller));
    }
    catch (error) {
        throw new Error(`Error creating if seller exists: ${error}`);
    }
    ;
}
exports.createSeller = createSeller;
;
async function checkEmail(email) {
    try {
        const emailCheck = await seller_1.Seller.findOne({
            where: { email }
        });
        return emailCheck ? true : false;
    }
    catch (error) {
        throw new Error(`Error checking if email exists: ${error}`);
    }
    ;
}
exports.checkEmail = checkEmail;
;
async function checkPhoneNumber(phone_number) {
    try {
        const phoneNumberCheck = await seller_1.Seller.findOne({
            where: { phone_number }
        });
        return phoneNumberCheck ? true : false;
    }
    catch (error) {
        throw new Error(`Error checking if phone_number exists: ${error}`);
    }
    ;
}
exports.checkPhoneNumber = checkPhoneNumber;
;
async function hashPassword(password) {
    try {
        const saltRounds = 10;
        const hash = await bcrypt_1.default.hash(password, saltRounds);
        return hash;
    }
    catch (error) {
        throw new Error(`Error hashing password: ${error}`);
    }
    ;
}
exports.hashPassword = hashPassword;
;
async function getSellerByEmail(email) {
    try {
        const seller = await seller_1.Seller.findOne({
            attributes: { exclude: ['hashed_password', 'image_key', 'createdAt', 'updatedAt'] },
            where: { email }
        });
        return JSON.parse(JSON.stringify(seller));
    }
    catch (error) {
        throw new Error(`Error getting user by email: ${error}`);
    }
    ;
}
exports.getSellerByEmail = getSellerByEmail;
;
async function retrieveHashedPassword(email) {
    try {
        const sellerPassword = await seller_1.Seller.findOne({
            attributes: ["hashed_password"],
            where: { email }
        });
        return JSON.parse(JSON.stringify(sellerPassword)).hashed_password;
    }
    catch (error) {
        throw new Error(`Error retrieving seller password: ${error}`);
    }
    ;
}
exports.retrieveHashedPassword = retrieveHashedPassword;
;
async function confirmRetrievedPassword(password, hashedPassword) {
    try {
        const confirmPassword = await bcrypt_1.default.compare(password, hashedPassword);
        return confirmPassword;
    }
    catch (error) {
        throw new Error(`Error comfirming password: ${error}`);
    }
    ;
}
exports.confirmRetrievedPassword = confirmRetrievedPassword;
;
async function getSellerById(id) {
    try {
        const seller = await seller_1.Seller.findOne({
            attributes: { exclude: ['hashed_password', 'image_key', 'createdAt', 'updatedAt'] },
            where: { id }
        });
        return JSON.parse(JSON.stringify(seller));
    }
    catch (error) {
        throw new Error(`Error getting seller by id: ${error}`);
    }
    ;
}
exports.getSellerById = getSellerById;
;
async function getSellerWithoutAddressId(id) {
    try {
        const seller = await seller_1.Seller.findOne({
            attributes: { exclude: ['address_id', 'hashed_password', 'image_key', 'createdAt', 'updatedAt'] },
            where: { id }
        });
        return JSON.parse(JSON.stringify(seller));
    }
    catch (error) {
        throw new Error(`Error getting seller by id: ${error}`);
    }
    ;
}
exports.getSellerWithoutAddressId = getSellerWithoutAddressId;
;
async function getFullSellerDetails(seller_id, seller_address_id) {
    try {
        const sellerDetails = await getSellerById(seller_id);
        const address_details = await (0, addressFunctions_1.getOnlyAddressDetails)(seller_address_id);
        const sellerFullDetails = { ...sellerDetails, address_details };
        return sellerFullDetails;
    }
    catch (error) {
        throw new Error(`Error getting seller full details: ${error}`);
    }
    ;
}
exports.getFullSellerDetails = getFullSellerDetails;
;
function checkIfEntriesMatch(firstValue, secondValue) {
    return firstValue === secondValue;
}
exports.checkIfEntriesMatch = checkIfEntriesMatch;
;
async function updateSellerAccountDetails(id, first_name, last_name, email, phone_number) {
    try {
        const updated = await seller_1.Seller.update({ first_name, last_name, email, phone_number }, {
            where: { id }
        });
        return updated;
    }
    catch (error) {
        throw new Error(`Error updating seller details: ${error}`);
    }
    ;
}
exports.updateSellerAccountDetails = updateSellerAccountDetails;
;
async function deleteSellerAccount(id) {
    try {
        const deletedAccount = await seller_1.Seller.destroy({
            where: { id }
        });
        return deletedAccount;
    }
    catch (error) {
        throw new Error(`Error deleting seller account: ${error}`);
    }
    ;
}
exports.deleteSellerAccount = deleteSellerAccount;
;
async function saveSellerImageKey(id, image_key) {
    try {
        const updated = await seller_1.Seller.update({ image_key }, {
            where: { id }
        });
        return updated;
    }
    catch (error) {
        throw new Error(`Error saving profile photo: ${error}`);
    }
    ;
}
exports.saveSellerImageKey = saveSellerImageKey;
;
