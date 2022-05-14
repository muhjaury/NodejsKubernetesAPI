const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv/config");

//Middleware
app.use(bodyParser.json());
app.use(cors());

//Import Routes
const userRoute = require("./routes/user");
const loginRoute = require("./routes/auth");
app.use("/api", userRoute);
app.use("/user", loginRoute);

//Connect MongoDB
mongoose.connect(
  process.env.DATABASE_CONNECTION,
  { useNewUrlParser: true },
  () => console.log("Connected to MongoDB")
);
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Database Connection Error"));
db.once("open", () => {
  console.log("Success connected to MongoDB");
});

//Listener
app.listen(process.env.PORT, () =>
  console.log({ statusCode: "200", message: "Welcome to Sejutacita API" })
);
