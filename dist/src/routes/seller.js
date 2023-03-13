"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sellerAuth_1 = require("../auth/sellerAuth");
// import {upload} from '../images2/uploads';
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'uploads/ ' });
const seller_1 = require("../controllers/seller");
const router = express_1.default.Router();
router.post('/signup', seller_1.signUpSeller);
router.post('/login', seller_1.loginSeller);
router.put('/update_account', sellerAuth_1.verifySellerToken, seller_1.updateSellerAccount);
router.get('/get_account', sellerAuth_1.verifySellerToken, seller_1.getSellerAccount);
router.delete('/delete_account', sellerAuth_1.verifySellerToken, seller_1.deleteAccount);
router.post('/upload-image', sellerAuth_1.verifySellerToken, upload.single('image'), seller_1.uploadSellerImage);
exports.default = router;
