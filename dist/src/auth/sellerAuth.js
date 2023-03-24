"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySellerToken = exports.generateSellerToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.PAYLOAD_SECRET;
if (!secretKey) {
    throw new Error("Missing required environment variable for Seller Authentication");
}
function generateSellerToken(payload) {
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
exports.generateSellerToken = generateSellerToken;
;
async function verifySellerToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            error: "You are unauthorized to perform this operation.",
        });
    }
    try {
        const seller = jsonwebtoken_1.default.verify(token, secretKey);
        req.seller = seller;
        next();
    }
    catch (error) {
        return res.status(403).send({
            error: "Session expired! please login to perform operation.",
        });
    }
}
exports.verifySellerToken = verifySellerToken;
