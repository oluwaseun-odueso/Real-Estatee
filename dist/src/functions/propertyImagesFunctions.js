"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyArray = exports.deletePropertyImages = exports.createPropertyImage = void 0;
const propertyImages_1 = require("../models/propertyImages");
async function createPropertyImage(propertyImageDetails) {
    try {
        const imageDetails = await propertyImages_1.PropertyImages.create(propertyImageDetails);
        return JSON.parse(JSON.stringify(imageDetails));
    }
    catch (error) {
        throw new Error(`Error adding property for sale: ${error}`);
    }
    ;
}
exports.createPropertyImage = createPropertyImage;
;
async function deletePropertyImages(image_key) {
    try {
        const deletedPropertyDetails = await propertyImages_1.PropertyImages.destroy({
            where: { image_key }
        });
        return deletedPropertyDetails;
    }
    catch (error) {
        throw new Error(`Error deleting Images details: ${error}`);
    }
}
exports.deletePropertyImages = deletePropertyImages;
;
function getKeyArray(input) {
    const keyArray = [];
    input.forEach(object => {
        keyArray.push(object['Key']);
    });
    return keyArray;
}
exports.getKeyArray = getKeyArray;
;
