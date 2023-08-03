require("dotenv").config();
require("./database/database.js").connect();
const express = require("express");
const app = express();
const usersRouter = require("./routes/users");

const port = 3000;

app.use(express.json());

app.use("/api/v1/users", usersRouter);

app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`);
});