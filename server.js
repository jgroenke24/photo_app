import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import '@babel/polyfill';

import photosRouter from './routes/photo';

dotenv.config();

const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Increase security with helmet
app.use(helmet());

// parse json and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

// Allow CORS requests
app.use(cors());

// Log HTTP requests
app.use(morgan('combined'));

// Enable passport
app.use(passport.initialize());

// Route handlers
app.use('/api/photos', photosRouter);

app.get('/', (req, res) => {
//   return res.status(200).send({ message: 'The endpoint worked!' });
  return res.render('index');
});

app.listen(8081, process.env.IP, () => console.log("photo app Server Started"));