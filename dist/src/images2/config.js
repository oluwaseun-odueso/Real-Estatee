"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3_BUCKET_NAME = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
require('dotenv').config();
exports.S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const keyId = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_BUCKET_REGION;
if (!exports.S3_BUCKET_NAME || !keyId || !secretKey || !region) {
    throw new Error("Missing required environment variable for Image function");
}
aws_sdk_1.default.config.update({
    region: region,
    accessKeyId: keyId,
    secretAccessKey: secretKey,
});
exports.default = aws_sdk_1.default;
