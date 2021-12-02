import express, { Express } from 'express';
import dotenv from 'dotenv';
import products from './api/products/products.api';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json()) // application/json
app.use(express.urlencoded({ extended: true })) // application/x-www-form-urlencoded

// products api
app.use('/products', products);

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));