import { Request } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from 'dotenv';
import s3 from "./config";

dotenv.config();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request, file: Express.Multer.File, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

export default upload;
