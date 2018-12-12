import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import '@babel/polyfill';

import photosRouter from './routes/photo';

dotenv.config();

const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Route handlers
app.use('/photos', photosRouter);

app.get('/', (req, res) => {
//   return res.status(200).send({ message: 'The endpoint worked!' });
  return res.render('index');
});

app.listen(process.env.PORT, process.env.IP,() => console.log("photo app Server Started"));