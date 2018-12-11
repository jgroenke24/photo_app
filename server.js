import express from 'express';
import dotenv from 'dotenv';
import '@babel/polyfill';

import photosRouter from './routes/photo';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/photos', photosRouter);

app.get('/', (req, res) => {
  return res.status(200).send({ message: 'The endpoint worked!' });
});

app.listen(process.env.PORT, process.env.IP,() => console.log("photo app Server Started"));