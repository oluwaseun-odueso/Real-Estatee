import { Request, Response } from 'express';
import multer from "multer";
const multerS3 = require("multer-s3");
import AWS from './config';
import {S3_BUCKET_NAME} from './config'

const s3 = new AWS.S3({
    apiVersion: "2023-03-02"
});

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // metadata: function (req: Request, file: any, cb: (arg0: null, arg1: { fieldName: any; }) => void) {
    //   cb(null, { fieldName: file.fieldname });
    // },
    key: function (req: Request, file: any, cb: (arg0: null, arg1: string) => void) {
      cb(null, file.originalname);
    },
  }),
});
