"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
require("dotenv").config();
const router = express_1.default.Router();
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_BUCKET_REGION;
if (!bucketName || !accessKeyId || !secretAccessKey || !region) {
    throw new Error("Missing required environment variable for images");
}
const s3 = new client_s3_1.S3Client({ credentials: { accessKeyId, secretAccessKey } });
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: bucketName,
        metadata: function (req, file, cb) {
            console.log(file);
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        },
    }),
});
router.post("/upload_image", upload.array("photos", 3), function (req, res, next) {
    const files = req.files;
    console.log(req.files);
    // res.send('Successfully uploaded ' + files.length + ' files!')
    res.send({
        message: "Uploaded!",
        urls: files.map(function (file) {
            return {
                url: file.location,
                name: file.key,
                type: file.mimetype,
                size: file.size,
            };
        }),
    });
});
exports.default = router;
