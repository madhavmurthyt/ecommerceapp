import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import initDB from './initdb.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3232;
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce App!');
});

// Register user
app.get('/registeruser', (req,res) => {

})
// Authenticate user
// view and search for products
// add products to cart
// remove products from cart
// users to checkout and pay for products

// add products 
// add inventory for each product


app.listen(PORT, async () => {
  await initDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

