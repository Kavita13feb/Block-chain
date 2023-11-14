require("dotenv").config();

const mongoose = require("mongoose");
console.log(process.env.mongoUrl)






const connection = mongoose.connect(process.env.mongoUrl);
module.exports = connection;
