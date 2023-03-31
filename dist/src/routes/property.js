"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sellerAuth_1 = require("../auth/sellerAuth");
const property_1 = require("../controllers/property");
const propertyFeature_1 = require("../controllers/propertyFeature");
const seller_1 = require("../controllers/seller");
const image_config_1 = require("../image.config");
const router = express_1.default.Router();
router.post('/put_property_for_sale', sellerAuth_1.verifySellerToken, property_1.addProperty);
router.post('/add_property_features/:id', sellerAuth_1.verifySellerToken, propertyFeature_1.addPropertyFeature);
router.get('/get_property/:id', property_1.getProperty);
router.get('/get_property_features/:id', propertyFeature_1.getPropertyFeatures);
router.get('/get_all_properties', property_1.getProperties);
router.put('/update_property/:id', sellerAuth_1.verifySellerToken, property_1.updateProperty);
router.put('/update_property_features/:id', sellerAuth_1.verifySellerToken, propertyFeature_1.updatePropertyFeatures);
router.delete('/delete_property/:id', sellerAuth_1.verifySellerToken, property_1.deleteProperty);
router.post('/upload_images/:id', sellerAuth_1.verifySellerToken, image_config_1.upload.array('images', 30), property_1.uploadImages);
router.get('/get_image/:filename', seller_1.getImage);
router.delete('/delete_images/:id', sellerAuth_1.verifySellerToken, property_1.deleteImages);
exports.default = router;
