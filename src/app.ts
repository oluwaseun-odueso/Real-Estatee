import express, { Application, Request, Response, NextFunction} from 'express';
import sellerRoutes from './routes/seller';
import propertyRoutes from './routes/property';
import buyerRoutes from './routes/buyer';
import cors from 'cors'; 
import upload from "./multer.config";

import dotenv from 'dotenv';

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

app.use('/seller', sellerRoutes);
app.use('/property', propertyRoutes);
app.use('/buyer', buyerRoutes)

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({success: true, message: " Official Real Estate Page"});
});

app.post('/upload', upload.single('image'), function (req, res, next) {
    const file: any = req.file
    res.status(200).json({ message: "File uploaded successfully" , url: file.location});
    // res.send('Successfully uploaded ' + file.location + ' location!')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;