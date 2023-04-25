import express, { Application, Request, Response, NextFunction} from 'express';
import sellerRoutes from './routes/seller';
import propertyRoutes from './routes/property';
import buyerRoutes from './routes/buyer';
import transactionRoutes from './routes/transaction';
import cors from 'cors'; 
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app: Application = express();

app.use(express.json());
app.use(
  cors()
);

app.use('/seller', sellerRoutes);
app.use('/property', propertyRoutes);
app.use('/buyer', buyerRoutes);
app.use('/transaction', transactionRoutes);

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .send({ success: true, message: " Official Real Estate Page" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
