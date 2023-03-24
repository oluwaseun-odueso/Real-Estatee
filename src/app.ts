import express, { Application, Request, Response, NextFunction} from 'express';
import sellerRoutes from './routes/seller';
import propertyRoutes from './routes/property';
import buyerRoutes from './routes/buyer'
import images from './images/controller';
import cors from 'cors'
import { mail } from './util/mail';
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app: Application = express();

app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:3000', 'https://real-estate-collab.vercel.app/'],
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
    })
)
app.use('/seller', sellerRoutes);
app.use('/property', propertyRoutes);
app.use('/buyer', buyerRoutes)
app.use('/image', images)

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({success: true, message: " Official Real Estate Page"});
});

app.get('/logout', (req, res) => {
    
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;