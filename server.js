import express from 'express';
import dotenv from 'dotenv';
import '@babel/polyfill';
import path from 'path';

import photosRouter from './routes/photo';

dotenv.config();

const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());

// Route handlers
app.use('/photos', photosRouter);

app.get('/', (req, res) => {
  return res.render('index');
});

app.listen(process.env.PORT, process.env.IP,() => console.log("photo app Server Started"));