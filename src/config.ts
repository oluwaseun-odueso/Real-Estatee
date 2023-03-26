import { S3 } from "aws-sdk";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv'

dotenv.config();

// const s3 = new S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY!,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
// });
const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_BUCKET_REGION!,
  });
  

export default s3Client;
