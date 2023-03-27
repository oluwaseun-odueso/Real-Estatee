"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const sellerAuth_1 = require("../auth/sellerAuth");
const seller_1 = require("../controllers/seller");
const image_config_1 = require("../image.config");
const router = express_1.default.Router();
router.post('/signup', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/), seller_1.signUpSeller);
router.post('/login', (0, express_validator_1.body)('email').isEmail(), seller_1.loginSeller);
router.put('/update_account', sellerAuth_1.verifySellerToken, seller_1.updateSellerAccount);
router.get('/get_account', sellerAuth_1.verifySellerToken, seller_1.getSellerAccount);
router.delete('/delete_account', sellerAuth_1.verifySellerToken, seller_1.deleteAccount);
router.put('/update_password', sellerAuth_1.verifySellerToken, seller_1.updateSellerPassword);
router.post('/upload_image', sellerAuth_1.verifySellerToken, image_config_1.upload.single('image'), seller_1.uploadImage);
router.post('/reset_password', sellerAuth_1.verifySellerToken, seller_1.resetSellerPassword);
exports.default = router;
