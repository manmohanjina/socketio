
const mongoose = require('mongoose');
require('dotenv').config()

const connection = () => {
  return mongoose
    .connect(process.env.mongo_url)
    .then(() => {
      console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
};

module.exports={
    connection
}