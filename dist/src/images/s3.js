"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFile = exports.uploadFile = void 0;
require('dotenv').config();
const fs_1 = __importDefault(require("fs"));
const S3 = require('aws-sdk/clients/s3');
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});
// uploads images to s3
function uploadFile(file) {
    const fileStream = fs_1.default.createReadStream(file.path);
    // const fileStream = file
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    };
    return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;
;
// downloads/gets a file from s3
function getFile(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    };
    return s3.getObject(downloadParams).createReadStream();
}
exports.getFile = getFile;
;
async function deleteFile(fileKey) {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    };
    return s3.deleteObject(deleteParams).promise();
}
exports.deleteFile = deleteFile;
;
