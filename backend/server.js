import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import path from 'path';
import cookieParser from "cookie-parser";
import createFullForm from './routes/createfullform.route.js';
import userRouter from './routes/user.route.js';
import authMiddleware from "./middleware/auth.middleware.js";
import submitTest from "./routes/test.route.js";

import {connectDB} from "./config/db.js";


const __dirname = path.resolve();

const PORT = process.env.PORT || 5001;

const app = express();
dotenv.config();

app.use(cors(
  {
    origin: 'http://localhost:5001',
    credentials: true
  }
));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', userRouter);
app.use('/api/forms',authMiddleware,createFullForm);
app.use('/api/test',authMiddleware,submitTest);


if (process.env.NODE_ENV === 'production') {
  console.log('Production mode enabled');
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
  });
}


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port http://localhost:${PORT}`);
});