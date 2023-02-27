import express, { Application, Request, Response, NextFunction} from 'express';
import sellerRoutes from './routes/seller';
import propertyRoutes from './routes/property';
import images from './images/controller';
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app: Application = express();

app.use(express.json());
app.use('/seller', sellerRoutes);
app.use('/property', propertyRoutes);
app.use('/image', images)

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({success: true, message: " Official Real Estate Page"});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;