"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSellerPassword = exports.updateSellerPassword = exports.deleteAccount = exports.getSellerAccount = exports.updateSellerAccount = exports.loginSeller = exports.signUpSeller = void 0;
const express_validator_1 = require("express-validator");
const sellerAuth_1 = require("../auth/sellerAuth");
const addressFunctions_1 = require("../functions/addressFunctions");
const sellerFunctions_1 = require("../functions/sellerFunctions");
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const mail_1 = require("../util/mail");
const unlinkFile = util_1.default.promisify(fs_1.default.unlink);
async function signUpSeller(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    try {
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone_number || !req.body.street || !req.body.password) {
            res.status(400).json({
                success: false,
                message: "Please enter all required fields"
            });
            return;
        }
        ;
        const { first_name, last_name, email, phone_number, street, city, state, country, image_key, password } = req.body;
        // Validate email and password
        if (!errors.isEmpty()) {
            const error = errors.array()[0];
            if (error.param === 'email') {
                return res.status(400).json({ success: false, message: 'Invalid email address. Please try again.' });
            }
            if (error.param === 'password') {
                return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long, must contain at least one lowercase letter, one uppercase letter, one number and one special character.' });
            }
        }
        if (await (0, sellerFunctions_1.checkEmail)(email)) {
            res.status(400).send({ success: false, message: "Email already exists" });
            return;
        }
        ;
        if (await (0, sellerFunctions_1.checkPhoneNumber)(phone_number)) {
            res.status(400).send({ success: false, message: "Phone number already exists" });
            return;
        }
        ;
        const hashed_password = await (0, sellerFunctions_1.hashPassword)(password);
        const address = await (0, addressFunctions_1.addAddress)({ street, city, state, country });
        const address_id = address.id;
        await (0, sellerFunctions_1.createSeller)({ address_id, first_name, last_name, email, phone_number, image_key, hashed_password });
        const seller = await (0, sellerFunctions_1.getSellerByEmail)(email);
        res.status(201).send({ success: true, message: "Your account has been created", seller });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the seller's account",
            error: error.message
        });
    }
    ;
}
exports.signUpSeller = signUpSeller;
;
async function loginSeller(req, res) {
    try {
        if (!req.body.email || !req.body.password) {
            res.status(400).json({
                success: false,
                message: "Please enter email and password"
            });
            return;
        }
        ;
        const { email, password } = req.body;
        const sellerDetails = await (0, sellerFunctions_1.getSellerByEmail)(email);
        if (!sellerDetails) {
            res.status(400).send({ success: false, message: "The email you entered does not exist" });
            return;
        }
        ;
        const collectedSellerPassword = await (0, sellerFunctions_1.retrieveSellerHashedPassword)(email);
        if (await (0, sellerFunctions_1.confirmSellerRetrievedPassword)(password, collectedSellerPassword) !== true) {
            res.status(400).send({ success: false, message: "You have entered an incorrect password" });
            return;
        }
        ;
        const seller = await (0, sellerFunctions_1.getFullSellerDetails)(sellerDetails.id, sellerDetails.address_id);
        const token = await (0, sellerAuth_1.generateSellerToken)(seller);
        res.status(200).send({
            success: true,
            message: "You have successfully logged in",
            seller,
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging in seller",
            error: error.message
        });
    }
    ;
}
exports.loginSeller = loginSeller;
;
async function updateSellerAccount(req, res) {
    try {
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone_number || !req.body.street) {
            res.status(400).json({
                success: false,
                message: "Please enter all required fields"
            });
            return;
        }
        ;
        const { first_name, last_name, email, phone_number, street, city, state, country, postal_code } = req.body;
        const seller = await (0, sellerFunctions_1.getSellerById)(req.seller.id);
        if (await (0, sellerFunctions_1.checkEmail)(email) && !(0, sellerFunctions_1.checkIfEntriesMatch)(seller.email, email)) {
            res.status(400).send({
                success: false,
                message: "Email already exists"
            });
            return;
        }
        ;
        if (await (0, sellerFunctions_1.checkPhoneNumber)(phone_number) && !(0, sellerFunctions_1.checkIfEntriesMatch)(seller.phone_number, phone_number)) {
            res.status(400).send({
                success: false,
                message: "Phone number already exists"
            });
            return;
        }
        ;
        await (0, sellerFunctions_1.updateSellerAccountDetails)(req.seller.id, first_name, last_name, email, phone_number);
        await (0, addressFunctions_1.updateAddressDetails)(req.seller.address_id, street, city, state, country, postal_code);
        const new_details = await (0, sellerFunctions_1.getFullSellerDetails)(req.seller.id, req.seller.address_id);
        res.status(200).send({
            success: true,
            message: 'Your account has been updated!',
            new_details
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating seller account',
            error: error.message
        });
    }
    ;
}
exports.updateSellerAccount = updateSellerAccount;
;
async function getSellerAccount(req, res) {
    try {
        const seller = await (0, sellerFunctions_1.getFullSellerDetails)(req.seller.id, req.seller.address_id);
        if (!seller) {
            res.status(400).send({
                success: false,
                message: "Oops! You do not have an account, sign up to continue."
            });
            return;
        }
        ;
        res.status(200).send({
            success: true,
            seller
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error getting seller's account details",
            error: error.message
        });
    }
    ;
}
exports.getSellerAccount = getSellerAccount;
;
async function deleteAccount(req, res) {
    try {
        const deletedAccount = await (0, sellerFunctions_1.deleteSellerAccount)(req.seller.id);
        if (deletedAccount === 1) {
            res.status(200).send({
                success: true,
                message: "Your account has been deleted!"
            });
            return;
        }
        ;
        res.status(400).send({
            success: false,
            message: "You do not have an account, sign up to create an account"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Could not delete your account',
            error: error.message
        });
    }
    ;
}
exports.deleteAccount = deleteAccount;
;
async function updateSellerPassword(req, res) {
    try {
        if (!req.body.current_password || !req.body.new_password) {
            res.status(400).json({
                success: false,
                message: "Please enter your current password and a new password"
            });
            return;
        }
        ;
        const { current_password, new_password } = req.body;
        const collectedSellerPassword = await (0, sellerFunctions_1.retrieveSellerHashedPassword)(req.seller.email);
        if (await (0, sellerFunctions_1.confirmSellerRetrievedPassword)(current_password, collectedSellerPassword) !== true) {
            res.status(400).json({ success: false, message: "Current password is incorrect" });
            return;
        }
        ;
        const new_hashed_password = await (0, sellerFunctions_1.hashPassword)(new_password);
        await (0, sellerFunctions_1.updatePassword)(req.seller.id, new_hashed_password);
        res.status(200).json({
            success: true,
            message: 'Your password has been updated!',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: error.message
        });
    }
    ;
}
exports.updateSellerPassword = updateSellerPassword;
;
async function resetSellerPassword(req, res) {
    try {
        const buyer = await (0, sellerFunctions_1.getSellerById)(req.seller.id);
        await (0, mail_1.mail)(buyer.email);
        res.status(200).send({
            success: true,
            message: "A reset token has been sent to your registered email"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Could not process reset password',
            error: error.message
        });
    }
}
exports.resetSellerPassword = resetSellerPassword;
