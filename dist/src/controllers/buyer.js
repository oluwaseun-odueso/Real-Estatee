"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBuyerAccount = exports.getBuyerAccount = exports.updateBuyerAccount = exports.loginBuyer = exports.signUpBuyer = void 0;
const buyerAuth_1 = require("../auth/buyerAuth");
const addressFunctions_1 = require("../functions/addressFunctions");
const buyerFunctions_1 = require("../functions/buyerFunctions");
async function signUpBuyer(req, res) {
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
        if (await (0, buyerFunctions_1.checkBuyerEmail)(email)) {
            res.status(400).send({ success: false, message: "Email already exists" });
            return;
        }
        ;
        if (await (0, buyerFunctions_1.checkBuyerPhoneNumber)(phone_number)) {
            res.status(400).send({ success: false, message: "Phone number already exists" });
            return;
        }
        ;
        const hashed_password = await (0, buyerFunctions_1.hashBuyerPassword)(password);
        const address = await (0, addressFunctions_1.addAddress)({ street, city, state, country });
        const address_id = address.id;
        await (0, buyerFunctions_1.createBuyer)({ address_id, first_name, last_name, email, phone_number, image_key, hashed_password });
        const seller = await (0, buyerFunctions_1.getBuyerByEmail)(email);
        res.status(201).send({ success: true, message: "Your account has been created", seller });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating buyer's account",
            error: error.message
        });
    }
    ;
}
exports.signUpBuyer = signUpBuyer;
;
async function loginBuyer(req, res) {
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
        const buyerDetails = await (0, buyerFunctions_1.getBuyerByEmail)(email);
        if (!buyerDetails) {
            res.status(400).send({ success: false, message: "The email you entered does not exist" });
            return;
        }
        ;
        const collectedBuyerPassword = await (0, buyerFunctions_1.retrieveBuyerHashedPassword)(email);
        if (await (0, buyerFunctions_1.confirmBuyerRetrievedPassword)(password, collectedBuyerPassword) !== true) {
            res.status(400).send({ success: false, message: "You have entered an incorrect password" });
            return;
        }
        ;
        const buyer = await (0, buyerFunctions_1.getFullBuyerDetails)(buyerDetails.id, buyerDetails.address_id);
        const token = await (0, buyerAuth_1.generateBuyerToken)(buyer);
        res.status(200).send({
            success: true,
            message: "You have successfully logged in",
            buyer,
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error logging in buyer',
            error: error.message
        });
    }
    ;
}
exports.loginBuyer = loginBuyer;
;
async function updateBuyerAccount(req, res) {
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
        const buyer = await (0, buyerFunctions_1.getBuyerById)(req.buyer.id);
        if (await (0, buyerFunctions_1.checkBuyerEmail)(email) && !(0, buyerFunctions_1.checkIfEntriesMatch)(buyer.email, email)) {
            res.status(400).send({
                success: false,
                message: "Email already exists"
            });
            return;
        }
        ;
        if (await (0, buyerFunctions_1.checkBuyerPhoneNumber)(phone_number) && !(0, buyerFunctions_1.checkIfEntriesMatch)(buyer.phone_number, phone_number)) {
            res.status(400).send({
                success: false,
                message: "Phone number already exists"
            });
            return;
        }
        ;
        await (0, buyerFunctions_1.updateBuyerAccountDetails)(req.buyer.id, first_name, last_name, email, phone_number);
        await (0, addressFunctions_1.updateAddressDetails)(req.buyer.address_id, street, city, state, country, postal_code);
        const new_details = await (0, buyerFunctions_1.getFullBuyerDetails)(req.buyer.id, req.buyer.address_id);
        res.status(200).send({
            success: true,
            message: 'Your account has been updated!',
            new_details
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating buyer account',
            error: error.message
        });
    }
    ;
}
exports.updateBuyerAccount = updateBuyerAccount;
;
async function getBuyerAccount(req, res) {
    try {
        const buyer = await (0, buyerFunctions_1.getFullBuyerDetails)(req.buyer.id, req.buyer.address_id);
        if (!buyer) {
            res.status(400).send({
                success: false,
                message: "Oops! You do not have an account, sign up to continue."
            });
            return;
        }
        ;
        res.status(200).send({
            success: true,
            buyer
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error getting buyer's account details",
            error: error.message
        });
    }
    ;
}
exports.getBuyerAccount = getBuyerAccount;
;
async function deleteBuyerAccount(req, res) {
    try {
        const deletedAccount = await (0, buyerFunctions_1.deleteAccount)(req.buyer.id);
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
exports.deleteBuyerAccount = deleteBuyerAccount;
;
