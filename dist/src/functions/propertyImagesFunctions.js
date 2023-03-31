"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPropertyImage = void 0;
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
