const mongoose = require("mongoose");

const mongoUri = process.env.DB_CNN;

const connect = async () => {
  await mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB", err));
};

module.exports = ({ connect });
