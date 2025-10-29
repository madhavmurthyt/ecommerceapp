import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import initDB from './initdb.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './models/index.js';
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


// add products to cart
// remove products from cart
// users to checkout and pay for products


// add inventory for each product



app.listen(PORT, async () => {
  await initDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

