import AWS from "aws-sdk";
require('dotenv').config();
export const S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;
const keyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY as string;
const region = process.env.AWS_BUCKET_REGION as string;

if (!S3_BUCKET_NAME || !keyId || !secretKey || !region) {
    throw new Error(
      "Missing required environment variable for Image function"
    );
  }

AWS.config.update({
    region: region,
    accessKeyId: keyId,
    secretAccessKey: secretKey,
});

export default AWS
