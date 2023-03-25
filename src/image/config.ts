import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION
});
  
const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, file.originalname);
      },
    }),
  });

router.post('/upload', upload.single('image'), (req: Request, res: Response) => {
res.status(200).send(req.file.location);
});

export default router;