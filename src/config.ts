import AWS from "aws-sdk";
import dotenv from 'dotenv'
dotenv.config();

export const S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

module.exports = {
  AWS,
};
