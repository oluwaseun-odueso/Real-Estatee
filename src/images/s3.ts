require('dotenv').config()
import fs from 'fs'
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});

// uploads images to s3
export function uploadFile(file: { path: any; filename: any; buffer: any }) {
    const fileStream = fs.createReadStream(file.buffer)
    const uploadParams = {
        Bucket: bucketName,
        acl: "public-read",
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise()
};
 
// downloads/gets a file from s3
export function getFile(fileKey: any) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
};

export async function deleteFile(fileKey: any) {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.deleteObject(deleteParams).promise()
};