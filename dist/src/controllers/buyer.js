"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.getImage = exports.uploadImage = exports.resetBuyerPassword = exports.deleteBuyerAccount = exports.getBuyerAccount = exports.updateBuyerPassword = exports.updateBuyerAccount = exports.loginBuyer = exports.signUpBuyer = void 0;
const express_validator_1 = require("express-validator");
const buyerAuth_1 = require("../auth/buyerAuth");
const addressFunctions_1 = require("../functions/addressFunctions");
const buyerFunctions_1 = require("../functions/buyerFunctions");
const image_config_1 = require("../image.config");
const mail_1 = require("../util/mail");
async function signUpBuyer(req, res) {
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
        const buyer = await (0, buyerFunctions_1.getBuyerByEmail)(email);
        res.status(201).send({
            success: true,
            message: "Your account has been created successfully",
            buyer
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the buyer's account",
            error: error.message
        });
    }
    ;
}
exports.signUpBuyer = signUpBuyer;
;
async function loginBuyer(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
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
        if (!errors.isEmpty()) {
            const error = errors.array()[0];
            if (error.param === 'email') {
                return res.status(400).json({ success: false, message: 'Invalid email address. Please try again.' });
            }
        }
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
            message: "An error occurred while logging in buyer",
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
        2;
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
async function updateBuyerPassword(req, res) {
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
        const collectedBuyerPassword = await (0, buyerFunctions_1.retrieveBuyerHashedPassword)(req.buyer.email);
        if (await (0, buyerFunctions_1.confirmBuyerRetrievedPassword)(current_password, collectedBuyerPassword) !== true) {
            res.status(400).send({ success: false, message: "Current password is incorrect" });
            return;
        }
        ;
        const new_hashed_password = await (0, buyerFunctions_1.hashBuyerPassword)(new_password);
        await (0, buyerFunctions_1.updatePassword)(req.buyer.id, new_hashed_password);
        res.status(200).send({
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
exports.updateBuyerPassword = updateBuyerPassword;
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
async function resetBuyerPassword(req, res) {
    try {
        const buyer = await (0, buyerFunctions_1.getBuyerById)(req.buyer.id);
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
    ;
}
exports.resetBuyerPassword = resetBuyerPassword;
;
async function uploadImage(req, res) {
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: 'No image uploaded.' });
        return;
    }
    try {
        // Save the image to S3
        const filename = `${Date.now()}-${file.originalname}`;
        const fileStream = file.buffer;
        const contentType = file.mimetype;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Body: fileStream,
            ContentType: contentType,
        };
        const result = await image_config_1.s3.upload(uploadParams).promise();
        await (0, buyerFunctions_1.saveBuyerImageUrlAndKey)(req.buyer.id, result.Key, result.Location);
        res.json({
            success: true,
            message: "Profile picture uploaded",
            key: result.Key,
            url: result.Location
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
    ;
}
exports.uploadImage = uploadImage;
;
async function getImage(req, res) {
    const imageKey = req.params.filename;
    try {
        // Retrieve the image from S3
        const downloadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageKey,
        };
        const objectData = await image_config_1.s3.getObject(downloadParams).promise();
        const imageBuffer = objectData.Body;
        // Set the Content-Type header to the image's MIME type
        const contentType = objectData.ContentType;
        res.set('Content-Type', contentType);
        // Return the image
        res.send(imageBuffer);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to get image',
            error: error.message
        });
    }
    ;
}
exports.getImage = getImage;
;
async function deleteImage(req, res) {
    // const filename = req.params.filename;
    try {
        const imageKey = await (0, buyerFunctions_1.getBuyerImageKey)(req.buyer.id);
        if (!imageKey) {
            res.status(400).send({
                success: false,
                message: "Image does not exist"
            });
            return;
        }
        ;
        // Delete the image from S3
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageKey,
        };
        await image_config_1.s3.deleteObject(deleteParams).promise();
        res.json({
            success: true,
            message: 'Image deleted.'
        });
        await (0, buyerFunctions_1.deleteBuyerImage)(req.buyer.id);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to delete image',
            error: error.message
        });
    }
    ;
}
exports.deleteImage = deleteImage;
;
