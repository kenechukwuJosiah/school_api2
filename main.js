const mongoose = require('mongoose');
const express = require('express');
const invoiceRouter = require('./route/routeControler');
// const postutmeControler = require('')

mongoose
  .connect('mongodb+srv://postutme:pWFC9k9Fc1gKsnbG@cluster0.aoro7.mongodb.net/postutme?authSource=admin', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connection successful');
  }).catch(() => console.log('ERROR'));

const app = express();

app.use(express.json());

app.use('/invoice',invoiceRouter);

app.listen(5000, () => {
  console.log('App running on port 5000');
});