import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import '@babel/polyfill';

import photosRouter from './routes/photo';
import usersRouter from './routes/user';

dotenv.config();

const app = express();

require('./config/passport');

// Increase security with helmet
app.use(helmet());

// parse json and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

// Allow CORS requests
app.use(cors(
  {
    credentials: true,
    origin: 'https://webdevbootcamp-jorge-groenke.c9users.io'
  }
));

// Log HTTP requests
app.use(morgan('combined'));

// Set up cookie parser
app.use(cookieParser());

// Enable passport
app.use(passport.initialize());

// Route handlers
app.use('/api/photos', photosRouter);
app.use('/', usersRouter);

app.listen(8081, process.env.IP, () => console.log("photo app Server Started"));