"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBuyerToken = exports.generateBuyerToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const secretKey = process.env.PAYLOAD_SECRET;
if (!secretKey) {
    throw new Error("Missing required environment variable for Buyer Authentication");
}
function generateBuyerToken(payload) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: "15m" }, (error, token) => {
            if (error) {
                reject(error);
            }
            else
                resolve(token);
        });
    });
}
exports.generateBuyerToken = generateBuyerToken;
;
async function verifyBuyerToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            error: "You are unauthorized to perform this operation.",
        });
    }
    try {
        const buyer = jsonwebtoken_1.default.verify(token, secretKey);
        req.buyer = buyer;
        next();
    }
    catch (error) {
        return res.status(403).send({
            error: "Your session has expired. Please log in again.",
        });
    }
}
exports.verifyBuyerToken = verifyBuyerToken;
