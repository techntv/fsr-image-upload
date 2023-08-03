require("dotenv").config();
require("./database/database.js").connect();
const express = require("express");
const app = express();
const usersRouter = require("./routes/users");
const auth = require("./middleware/auth");

const port = 8080;

app.use(express.json());

app.use("/api", usersRouter);

app.post("/api/hello", auth, (req, res) => {
  res.status(200).send("Hello 🙌 ");
});

app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`);
});