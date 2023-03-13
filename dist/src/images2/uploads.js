"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multerS3 = require("multer-s3");
const config_1 = __importDefault(require("./config"));
const config_2 = require("./config");
const s3 = new config_1.default.S3({
    apiVersion: "2023-03-02"
});
exports.upload = (0, multer_1.default)({
    storage: multerS3({
        s3: s3,
        bucket: config_2.S3_BUCKET_NAME,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});
