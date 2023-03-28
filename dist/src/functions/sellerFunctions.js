"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSellerImage = exports.saveSellerImageUrlAndKey = exports.deleteSellerAccount = exports.updatePassword = exports.updateSellerAccountDetails = exports.checkIfEntriesMatch = exports.getFullSellerDetails = exports.getSellerWithoutAddressId = exports.getSellerById = exports.confirmSellerRetrievedPassword = exports.getSellerImageKey = exports.retrieveSellerHashedPassword = exports.getSellerByEmail = exports.hashPassword = exports.checkPhoneNumber = exports.checkEmail = exports.createSeller = void 0;
const seller_1 = require("../models/seller");
const bcrypt_1 = __importDefault(require("bcrypt"));
const addressFunctions_1 = require("./addressFunctions");
async function createSeller(sellerDetails) {
    try {
        const seller = await seller_1.Seller.create(sellerDetails);
        return JSON.parse(JSON.stringify(seller));
    }
    catch (error) {
        throw new Error(`Error creating seller: ${error}`);
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
        throw new Error(`Error checking if seller's email exists: ${error}`);
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
        throw new Error(`Error checking if seller's phone_number exists: ${error}`);
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
        throw new Error(`Error hashing seller's password: ${error}`);
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
        throw new Error(`Error getting seller by email: ${error}`);
    }
    ;
}
exports.getSellerByEmail = getSellerByEmail;
;
async function retrieveSellerHashedPassword(email) {
    try {
        const sellerPassword = await seller_1.Seller.findOne({
            attributes: ["hashed_password"],
            where: { email }
        });
        return JSON.parse(JSON.stringify(sellerPassword)).hashed_password;
    }
    catch (error) {
        throw new Error(`Error retrieving seller's password: ${error}`);
    }
    ;
}
exports.retrieveSellerHashedPassword = retrieveSellerHashedPassword;
;
async function getSellerImageKey(id) {
    try {
        const sellerImageKey = await seller_1.Seller.findOne({
            attributes: ["image_key"],
            where: { id }
        });
        return JSON.parse(JSON.stringify(sellerImageKey)).image_key;
    }
    catch (error) {
        throw new Error(`Error retrieving seller's image key: ${error}`);
    }
}
exports.getSellerImageKey = getSellerImageKey;
;
async function confirmSellerRetrievedPassword(password, hashedPassword) {
    try {
        const confirmPassword = await bcrypt_1.default.compare(password, hashedPassword);
        return confirmPassword;
    }
    catch (error) {
        throw new Error(`Error comfirming seller's password: ${error}`);
    }
    ;
}
exports.confirmSellerRetrievedPassword = confirmSellerRetrievedPassword;
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
        throw new Error(`Error getting only seller's address details by id: ${error}`);
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
        throw new Error(`Error getting seller's full details: ${error}`);
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
        throw new Error(`Error updating seller's details: ${error}`);
    }
    ;
}
exports.updateSellerAccountDetails = updateSellerAccountDetails;
;
async function updatePassword(id, hashed_password) {
    try {
        const updatedPassword = await seller_1.Seller.update({ hashed_password }, {
            where: { id }
        });
        return updatedPassword;
    }
    catch (error) {
        throw new Error(`Error updating seller's password: ${error}`);
    }
}
exports.updatePassword = updatePassword;
async function deleteSellerAccount(id) {
    try {
        const deletedAccount = await seller_1.Seller.destroy({
            where: { id }
        });
        return deletedAccount;
    }
    catch (error) {
        throw new Error(`Error deleting seller's account: ${error}`);
    }
    ;
}
exports.deleteSellerAccount = deleteSellerAccount;
;
async function saveSellerImageUrlAndKey(id, image_key, image_url) {
    try {
        const updated = await seller_1.Seller.update({ image_key, image_url }, {
            where: { id }
        });
        return updated;
    }
    catch (error) {
        throw new Error(`Error saving seller's profile photo image url and key: ${error}`);
    }
    ;
}
exports.saveSellerImageUrlAndKey = saveSellerImageUrlAndKey;
;
async function deleteSellerImage(id) {
    try {
        const updated = await seller_1.Seller.update({ image_key: null, image_url: null }, {
            where: { id }
        });
        return updated;
    }
    catch (error) {
        throw new Error(`Error deleting seller's image: ${error}`);
    }
    ;
}
exports.deleteSellerImage = deleteSellerImage;
;
