import { S3Client } from '@aws-sdk/client-s3'
import express, {Request, Response} from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
require('dotenv').config()

const router = express.Router();
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const region = process.env.AWS_BUCKET_REGION


if (!bucketName || !accessKeyId || !secretAccessKey || !region) {
    throw new Error ("Missing required environment variable for images");
};

const s3 = new S3Client({credentials: {accessKeyId, secretAccessKey}})

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        console.log(file)
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })

router.post('/upload_image', upload.array('photos', 3), function(req, res, next) {
    const files: any = req.files
    console.log(req.files)
    // res.send('Successfully uploaded ' + files.length + ' files!')

    res.send({
        message: "Uploaded!",
        urls: files.map(function(file: any) {
            return {url: file.location, name: file.key, type: file.mimetype, size: file.size};
        })
    });
})

export default router;