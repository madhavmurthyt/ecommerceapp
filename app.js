import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import initDB from './db/init.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3232;
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce App!');
});

app.listen(PORT, () => {
    initDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

