import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({ message: 'The endpoint worked!' });
});

app.listen(process.env.PORT, process.env.IP,() => console.log("photo app Server Started"));