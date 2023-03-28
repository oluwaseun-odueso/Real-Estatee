"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const buyerAuth_1 = require("../auth/buyerAuth");
const buyer_1 = require("../controllers/buyer");
const image_config_1 = require("../image.config");
const router = express_1.default.Router();
router.post('/signup', (0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/), buyer_1.signUpBuyer);
router.post('/login', (0, express_validator_1.body)('email').isEmail(), buyer_1.loginBuyer);
router.put('/update_account', buyerAuth_1.verifyBuyerToken, buyer_1.updateBuyerAccount);
router.get('/get_account', buyerAuth_1.verifyBuyerToken, buyer_1.getBuyerAccount);
router.delete('/delete_account', buyerAuth_1.verifyBuyerToken, buyer_1.deleteBuyerAccount);
router.put('/update_password', buyerAuth_1.verifyBuyerToken, buyer_1.updateBuyerPassword);
router.post('/upload_image', buyerAuth_1.verifyBuyerToken, image_config_1.upload.single('image'), buyer_1.uploadImage);
router.post('/reset_password', buyerAuth_1.verifyBuyerToken, buyer_1.resetBuyerPassword);
exports.default = router;
