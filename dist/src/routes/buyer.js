"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const buyerAuth_1 = require("../auth/buyerAuth");
const buyer_1 = require("../controllers/buyer");
const router = express_1.default.Router();
router.post('/signup', buyer_1.signUpBuyer);
router.post('/login', buyer_1.loginBuyer);
router.put('/update_account', buyerAuth_1.verifyBuyerToken, buyer_1.updateBuyerAccount);
router.get('/get_account', buyerAuth_1.verifyBuyerToken, buyer_1.getBuyerAccount);
router.delete('/delete_account', buyerAuth_1.verifyBuyerToken, buyer_1.deleteBuyerAccount);
exports.default = router;
