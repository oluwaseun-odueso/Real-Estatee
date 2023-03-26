import express, { Application, Request, Response, NextFunction} from 'express';
import sellerRoutes from './routes/seller';
import propertyRoutes from './routes/property';
import buyerRoutes from './routes/buyer';
import cors from 'cors'; 
import dotenv from 'dotenv';
import multer from 'multer';
import AWS from 'aws-sdk';


dotenv.config();

const PORT = process.env.PORT || 5000;
const app: Application = express();

app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:3000', 'https://real-estate-collab.vercel.app/'],
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
    })
);

// Set up multer to handle file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type.'));
      }
    },
  });

// Set up an Amazon S3 client
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  });

app.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
const file = req.file;
if (!file) {
    res.status(400).json({ error: 'No image uploaded.' });
    return;
}

try {
    // Save the image to S3 or Google Cloud Storage
    const filename = `${Date.now()}-${file.originalname}`;
    const fileStream = file.buffer;
    const contentType = file.mimetype;
    const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: filename,
    Body: fileStream,
    ContentType: contentType,
    };
    await s3.upload(uploadParams).promise();
    
    res.json({ filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to upload image.' });
  }
});

// app.post('/upload', upload.single('image'), async (req, res) => {
//     try {
//       // Upload the file to S3
//       const file: any = req.file
//       const result = await uploadToS3(file);
  
//       // Return the S3 object key as the response
//       res.json({ key: result.Key });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error uploading file' });
//     }
//   });



app.use('/seller', sellerRoutes);
app.use('/property', propertyRoutes);
app.use('/buyer', buyerRoutes)

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({success: true, message: " Official Real Estate Page"});
});

// app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
//     res.status(200).send(req.file.location);
//   });
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;