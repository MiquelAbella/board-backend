require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connect } = require("./database/config");
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");

const PORT = process.env.PORT || 4000;
connect();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
