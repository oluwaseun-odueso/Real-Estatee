"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtAuth_1 = require("../auth/jwtAuth");
const property_1 = require("../controllers/property");
const propertyFeatures_1 = require("../controllers/propertyFeatures");
const router = express_1.default.Router();
router.post('/put_property_for_sale', jwtAuth_1.verifySellerToken, property_1.addProperty);
router.post('/add_property_features', jwtAuth_1.verifySellerToken, propertyFeatures_1.addPropertyFeature);
exports.default = router;
