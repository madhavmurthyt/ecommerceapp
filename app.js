import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import initDB from './initdb.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, Category, Product } from './models/index.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3232;
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce App!');
});

// Register user
app.post('/register', async (req,res) => {
    // Registration logic here
    const { email, password, firstname, lastname} = req.body;
    if(!email || !password || !firstname) {
        return res.status(400).json({ message: 'Fields missing' });
    }

    const result = await User.findOne({ where: { email } });
    if(result) {
        return res.status(409).json({ message: 'User already exists' });
    }
    console.log('password', password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword', hashedPassword);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        firstName: firstname,
        lastName: lastname
    });
    console.log('newUser.id', newUser.id);
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', userId: newUser.id, token });

})
// Authenticate user
app.get('/login', async (req,res) => {
    // Login logic here
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: 'Fields missing' });
    }

    const user = await User.findOne({ where: { email } });
    if(!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', userId: user.id, token });
});

// List all Products by category
app.get('/products/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    // Fetch products logic here
    if(!categoryId) {
        return res.status(400).json({ message: 'Category is required' });
    }
    const products = await Product.findAll({ where: { categoryId } });
    res.status(200).json({ products });
});


// add products to cart
app.post('/cart/add', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decoded;
        const { productId, quantity } = req.body;
        if(!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }
        const product = await Product.findOne({ where: { id: productId } });
        if(!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if(product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }
        // Add to cart logic here
        await CartItem.create({
            userId,
            productId,
            quantity
        });
        res.status(200).json({ message: 'Product added to cart successfully' });    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// remove products from cart
app.post('/cart/remove', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decoded;
        const { productId } = req.body;
        if(!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        // Remove from cart logic here
        await CartItem.destroy({
            where: {
                userId,
                productId
            }
        });
        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// users to checkout and pay for products

// add inventory for each product



app.listen(PORT, async () => {
  //await initDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

