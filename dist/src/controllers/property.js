"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImages = exports.uploadImages = exports.deleteProperty = exports.updateProperty = exports.getProperty = exports.addProperty = exports.getProperties = void 0;
const addressFunctions_1 = require("../functions/addressFunctions");
const propertyFeaturesFunctions_1 = require("../functions/propertyFeaturesFunctions");
const propertyFunctions_1 = require("../functions/propertyFunctions");
const propertyImagesFunctions_1 = require("../functions/propertyImagesFunctions");
const image_config_1 = require("../image.config");
async function getProperties(req, res) {
    try {
        const queries = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 20,
            search: String(req.query.search) || "",
            filter: String(req.query.filter) || ""
        };
        const properties = await (0, propertyFunctions_1.getManyProperties)(queries);
        res.status(200).send({
            success: true,
            properties
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching properties.',
            error: error.message
        });
    }
    ;
}
exports.getProperties = getProperties;
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
    ;
}
exports.addProperty = addProperty;
;
async function getProperty(req, res) {
    try {
        const property_id = parseInt(req.params.id, 10);
        const property = await (0, propertyFunctions_1.getPropertyById)(property_id);
        if (!property) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        }
        ;
        const propertyDetails = await (0, propertyFunctions_1.getFullPropertyDetails)(property_id, property.address_id);
        res.status(200).send({
            success: true,
            propertyDetails
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error adding property.',
            error: error.message
        });
    }
    ;
}
exports.getProperty = getProperty;
;
async function updateProperty(req, res) {
    try {
        if (!req.body.description || !req.body.type || !req.body.street || !req.body.price) {
            res.status(400).json({
                success: false,
                message: "Please enter all required fields"
            });
            return;
        }
        ;
        const property_id = parseInt(req.params.id, 10);
        const property = await (0, propertyFunctions_1.getPropertyById)(property_id);
        if (!await (0, propertyFunctions_1.checkIfSellerHasProperty)(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        }
        ;
        const { description, type, street, city, state, country, postal_code, price } = req.body;
        await (0, propertyFunctions_1.updatePropertyDetails)(property_id, description, type, price);
        await (0, addressFunctions_1.updateAddressDetails)(property.address_id, street, city, state, country, postal_code);
        const new_details = await (0, propertyFunctions_1.getFullPropertyDetails)(property_id, property.address_id);
        res.status(200).send({
            success: true,
            message: "Your property's details has been updated!",
            new_details
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating property details.',
            error: error.message
        });
    }
    ;
}
exports.updateProperty = updateProperty;
;
async function deleteProperty(req, res) {
    try {
        const property_id = parseInt(req.params.id, 10);
        if (!await (0, propertyFunctions_1.checkIfSellerHasProperty)(property_id, req.seller.id)) {
            res.status(400).send({
                success: false,
                message: "Property does not exist"
            });
            return;
        }
        ;
        const property = await (0, propertyFunctions_1.getPropertyById)(property_id);
        await (0, addressFunctions_1.deletePropertyAddress)(property.address_id);
        await (0, propertyFeaturesFunctions_1.deletePropertyFeatures)(property_id);
        await (0, propertyFunctions_1.deleteSellerProperty)(property_id, req.seller.id);
        res.status(200).send({
            success: true,
            message: "Property has been deleted!"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting property.',
            error: error.message
        });
    }
    ;
}
exports.deleteProperty = deleteProperty;
;
async function uploadImages(req, res) {
    const files = req.files;
    const property_id = parseInt(req.params.id, 10);
    try {
        let Keys = [];
        let Urls = [];
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const filename = `${Date.now()}-${files[i].originalname}`;
                const fileStream = files[i].buffer;
                const contentType = files[i].mimetype;
                const uploadParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: filename,
                    Body: fileStream,
                    ContentType: contentType,
                };
                const result = await image_config_1.s3.upload(uploadParams).promise();
                const image_key = result.Key;
                const image_url = result.Location;
                await (0, propertyImagesFunctions_1.createPropertyImage)({ property_id, image_key, image_url });
                Keys.push(result.Key);
                Urls.push(result.Location);
            }
        }
        res.json({
            success: true,
            message: "Pictures uploaded",
            keys: Keys,
            urls: Urls
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error uploading image(s)',
            error: error.message
        });
    }
}
exports.uploadImages = uploadImages;
;
async function deleteImages(req, res) {
    console.log(req.body);
    const imageKeys = req.body;
    console.log(imageKeys);
    try {
        // Delete the image from S3
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: imageKeys
            }
            // Key: imageKeys,
        };
        // await s3.deleteObjects(deleteParams).promise();
        // res.json({ 
        //     success: true, 
        //     message: 'Image(s) deleted.' 
        // });
        image_config_1.s3.deleteObjects(deleteParams, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error deleting images' });
            }
            else {
                console.log('Deleted objects:', data.Deleted);
                res.json({ message: 'Images deleted successfully' });
            }
        });
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
exports.deleteImages = deleteImages;
;
