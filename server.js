import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';
import cors from 'cors';
import morgan from 'morgan';
import v1Router from './src/routes/v1/index.js';
import dbConnect from "./src/config/dbConnect.js";
const app = express();
//DB
dbConnect();

//Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use('/', v1Router);


//err handler
app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

